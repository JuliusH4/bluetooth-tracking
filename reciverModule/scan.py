import os
import threading
import logging
from bluepy import btle
from datetime import datetime, timedelta
from flask import Flask
import paho.mqtt.client as mqtt

logging.basicConfig(level=logging.INFO)

HOST = "0.0.0.0"
PORT = 3300
SCAN_INTERVALL = 3  # seconds
MAX_STORED_VALUES = 10
# read bluetooth identity information and separate mac adress (test bevore space) from it
MAC_ADDRESS = os.popen(
    "sudo cat /sys/kernel/debug/bluetooth/hci0/identity").read().split(' ')[0]

broker_address = "192.168.178.146"
MQTT_TOPIC = "btt/sensorData"

scanner = btle.Scanner()
app = Flask(__name__)
mqtt_client = mqtt.Client(MAC_ADDRESS)
max_valid_data_time = timedelta(seconds = SCAN_INTERVALL * MAX_STORED_VALUES)

# oldes scan will be at the start, newest scan at the end
scans = []

### Functions ###

def is_scan_valid(scan: dict) -> bool:
    return (scan['start'] + max_valid_data_time ) > datetime.utcnow()

def scan_devices():
    # scan
    starttime = datetime.utcnow()
    logging.info(f"startBT Scan at {starttime}")
    devices = list(scanner.scan(SCAN_INTERVALL))
    endtime = datetime.utcnow()

    # safe scan
    result = {"start": starttime, "end": endtime, "devices": devices}
    logging.info(f"Scan results: {result}")
    scans.append(result)

    # remove old scans
    if len(scans) == 0:
        logging.error("Scans are empty")
    while len(scans) > 0 and not is_scan_valid(scans[0]):
        logging.info("Delete old Scan")
        scans.pop(0)

    # logging
    # devices.sort(key=lambda device: device.rssi, reverse=True)
    # print("--- New Scan ---")
    # print(f"start: {starttime}, end: {endtime}")
    # print(f"Found {len(devices)} devices:")
    # for device in devices:
    #     print(
    #         f"mac: {device.addr}; rssi: {device.rssi}; connectable: {device.connectable}")

def get_sensor_data() -> dict:
    logging.debug(f"Build Data from Signals {scans}")
    if len(scans) is 0:
        logging.debug("Get Sensor Data: No scans available")
        return none
    last_scan = scans[len(scans)-1]
    if len(scans)>1:
        previous_scan = scans[len(scans)-2]
    return {
        "mac_adress": MAC_ADDRESS,
        "time": {
            "start": last_scan['start'],
            "end": last_scan['end']
        },
        "signals": [
            {
                "device_id": "xxx",
                "current_rssi": -22,
                "difference": 3  # TODO: Calculate last scan - previous scan
            },
            {
                "device_id": "yyy",
                "current_rssi": -23
            }
        ]
    }

def send_data(data: str):
    logging.info(f"Send Data: {data}")
    mqtt_client.publish(MQTT_TOPIC, data)

#### Main ###

def run_flask():
    app.run(host=HOST, port=PORT)

def run_scan():
    while True:
        scan_devices()
        send_data(str(get_sensor_data()))

def main():
    logging.info(f"Start main with MAC Adress {MAC_ADDRESS}")
    if broker_address:
        logging.info(f"Connect MQTT Client to {broker_address}")
        mqtt_client.connect(broker_address)
    #t1 = threading.Thread(target=run_flask()).start()
    #t2 = threading.Thread(target=run_scan()).start()
    run_scan()

### Flask Routes ###

@app.route('/mqttbroaker', methods=['POST', 'PUT', 'CONNECT', 'OPTIONS'])
def set_mqttbroaker_ip():
    logging.info("revice http request")
    mqtt_client.connect(broker_address)

### Run code ###

if __name__ == "__main__":
    main()
