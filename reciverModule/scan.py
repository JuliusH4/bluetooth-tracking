import os
import threading
from bluepy import btle
from datetime import datetime, timedelta
from flask import Flask
import paho.mqtt.client as mqtt

HOST = "0.0.0.0"
PORT = 3300
SCAN_INTERVALL = 3  # seconds
MAX_STORED_VALUES = 10
# read bluetooth identity information and separate mac adress (test bevore space) from it
MAC_ADRESS = os.popen(
    "sudo cat /sys/kernel/debug/bluetooth/hci0/identity").read().split(' ')[0]

broker_address = "192.168.178.146"
MQTT_TOPIC = "btt/sensorData"

scanner = btle.Scanner()
app = Flask(__name__)
mqtt_client = mqtt.Client(MAC_ADRESS)

# oldes scan will be at the start, newest scan at the end
scans = []

### Functions ###
def on_connect(client, userdata, flags, rc):
    mqtt_client.rc = rc

mqtt_client.on_connect=on_connect

def scan_devices():
    # scan
    starttime = datetime.utcnow()
    devices = list(scanner.scan(SCAN_INTERVALL))
    endtime = datetime.utcnow()

    # safe scan
    scans.append({"start": starttime, "end": endtime, "devices": devices})

    # remove old scans
    max_valid_data_time = timedelta(seconds = SCAN_INTERVALL * MAX_STORED_VALUES)
    while (scans[0].start + max_valid_data_time ) > datetime.utcnow():
        scans.pop(0)

    # logging
    devices.sort(key=lambda device: device.rssi, reverse=True)
    print("--- New Scan ---")
    print(f"start: {starttime}, end: {endtime}")
    print(f"Found {len(devices)} devices:")
    for device in devices:
        print(
            f"mac: {device.addr}; rssi: {device.rssi}; connectable: {device.connectable}")

def get_sensor_data():
    if len(scans) is 0:
        return "No scans available", 500
    last_scan = scans[len(scans)-1]
    if len(scans)>1:
        previous_scan = scans[len(scans)-2]
    return {
        "mac_adress": MAC_ADRESS,
        "time": {
            "start": last_scan.start,
            "end": last_scan.end
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

def send_data(data):
    if mqtt_client.rc == 0:
        mqtt_client.publish(MQTT_TOPIC, data)

#### Main ###

def runFlask():
    app.run(host=HOST, port=PORT)

def runScan():
    while True:
        scan_devices()
        send_data(get_sensor_data())

def main():
    if broker_address:
        mqtt_client.connect(broker_address)
    t1 = threading.Thread(target=runFlask()).start()
    t2 = threading.Thread(target=runScan()).start()

### Flask Routes ###

@app.route('/mqttbroaker', methods=['POST', 'PUT', 'CONNECT', 'OPTIONS'])
def set_mqttbroaker_ip():
    mqtt_client.connect(broker_address)

### Run code ###

if __name__ == "__main__":
    main()
