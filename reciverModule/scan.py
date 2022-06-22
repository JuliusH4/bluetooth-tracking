import os
from threading import Thread
import logging
import json
from datetime import datetime, timedelta
from flask import Flask, request
from bluepy import btle
import paho.mqtt.client as mqtt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HOST = "0.0.0.0"
PORT = 3300
SCAN_INTERVALL = 3  # seconds
MAX_STORED_VALUES = 10
# read bluetooth identity information and separate mac adress (text before first space) from it
MAC_ADDRESS = os.popen(
    "sudo cat /sys/kernel/debug/bluetooth/hci0/identity").read().split(' ')[0]

broker_address = None
MQTT_TOPIC = "/btt/sensorData"

scanner = btle.Scanner()
app = Flask(__name__)
mqtt_client = mqtt.Client(MAC_ADDRESS)
max_valid_data_time = timedelta(seconds=SCAN_INTERVALL * MAX_STORED_VALUES)

# oldest scan will be at the start, newest scan at the end
scans = []


### Flask Routes ###

@app.route('/mqttbroaker', methods=['POST', 'PUT', 'CONNECT', 'OPTIONS'])
def set_mqttbroaker_ip():
    logger.info("revice http request")
    req_address = request.headers.get('x-mqtt-address')
    logger.info(f"recived Mqttbroker Request: {request}")
    if req_address:
        broker_address = req_address
        connect_to_broker(broker_address)
    return "Success"


### Functions ###

def is_scan_valid(scan: dict) -> bool:
    return (scan['start'] + max_valid_data_time) > datetime.utcnow()


def scan_devices():
    # scan
    starttime = datetime.utcnow()
    logger.info(f"startBT Scan at {starttime}")
    devices = list(scanner.scan(SCAN_INTERVALL))
    endtime = datetime.utcnow()

    # safe scan
    devices.sort(key=lambda device: device.rssi, reverse=True)
    devices_ = {}
    for device in devices:
        devices_[device.addr] = {
            "rssi": device.rssi,
            "connectable": device.connectable
        }
    result = {"start": starttime, "end": endtime, "devices": devices_}
    logger.info(f"Scan results: {result}")
    scans.append(result)

    # remove old scans
    if len(scans) == 0:
        logger.error("Scans are empty")
    while len(scans) > 0 and not is_scan_valid(scans[0]):
        logger.info("Delete old Scan")
        scans.pop(0)


def get_average(mac_address: str) -> int:
    sum = 0
    count = 0
    for scan in scans:
        device = scan["devices"].get(mac_address)
        if device:
            rssi = device["rssi"]
            count += 1
            sum += rssi
    if count < MAX_STORED_VALUES - 1:
        logger.info(f"Not enough Values: {count}")
        return None
    return int(sum / count)


# Print Scan #
    #
    # print("--- New Scan ---")
    # print(f"start: {starttime}, end: {endtime}")
    # print(f"Found {len(devices)} devices:")
    # for device in devices:
    #     print(
    #         f"mac: {device.addr}; rssi: {device.rssi}; connectable: {device.connectable}")

def format_signals(scans: list) -> list:
    out = []
    last_scan = scans[len(scans)-1]
    previous_scan = None
    if len(scans) > 1:
        previous_scan = scans[len(scans)-2]
    for device in last_scan["devices"]:
        device_ = last_scan["devices"][device]
        scandata = {
            "device_id": device,
            "is_connectable": device_["connectable"],
            "current_rssi": device_["rssi"],
        }
        if previous_scan:
            previous_data = previous_scan["devices"].get(device)
            if previous_data:
                scandata["difference"] = device_[
                    "rssi"] - previous_data["rssi"]
            else:
                scandata["difference"] = None
        else:
            scandata["difference"] = None
        avg = get_average(device)
        if avg:
            scandata["average_offset"] = device_["rssi"] - avg
        else:
            scandata["average_offset"] = None
        out.append(scandata)
    return out


def get_sensor_data() -> dict:
    logger.debug(f"Build Data from Signals {scans}")
    if len(scans) is 0:
        logger.debug("Get Sensor Data: No scans available")
        return None
    last_scan = scans[len(scans)-1]
    return {
        "client_id": MAC_ADDRESS,
        "time": {
            "start": str(last_scan['start']),
            "end": str(last_scan['end'])
        },
        "signals": format_signals(scans)
    }


def send_data(data: dict):
    out = json.dumps(data, sort_keys=True)
    logger.info(f"Send Data: {data}\n{out}")
    mqtt_client.publish(MQTT_TOPIC, out)


def connect_to_broker(address: str):
    logger.info(f"Connect MQTT Client to {address}")
    if not address:
        logger.error("No valid Address privided")
        return
    mqtt_client.connect(address)

#### Main ###


def run_flask():
    # make sure reloade is deactivated
    app.run(host=HOST, port=PORT, debug=True, use_reloader=False)


def run_scan():
    while True:
        scan_devices()
        send_data(get_sensor_data())


def main():
    logger.info(f"Start main with MAC Adress {MAC_ADDRESS}")
    t1 = Thread(target=run_flask).start()
    t2 = Thread(target=run_scan).start()


### Run code ###

if __name__ == "__main__":
    main()
