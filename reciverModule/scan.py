from bluepy import btle
import os
from datetime import datetime
from flask import Flask

HOST = "localhost"
PORT = 3300
SCAN_INTERVALL = 3  # seconds
MAX_STORED_VALUES = 10
# read bluetooth identity information and separate mac adress (test bevore space) from it
MAC_ADRESS = os.popen(
    "sudo cat /sys/kernel/debug/bluetooth/hci0/identity").read().split(' ')[0]

scanner = btle.Scanner()
app = Flask(__name__)

# oldes scan will be at the start, newest scan at the end
scans = []


def scan_devices():
    # scan
    starttime = datetime.utcnow()
    devices = list(scanner.scan(SCAN_INTERVALL))
    endtime = datetime.utcnow()

    # safe scan
    scans.append({"start": starttime, "end": endtime, "devices": devices})

    # remove old scans
    # TODO: Compre Datetime correctly
    while (scans[0].start + SCAN_INTERVALL * MAX_STORED_VALUES) > datetime.utcnow():
        scans.pop()  # TODO: Pop first element

    # logging
    devices.sort(key=lambda device: device.rssi, reverse=True)
    print("--- New Scan ---")
    print(f"start: {starttime}, end: {endtime}")
    print(f"Found {len(devices)} devices:")
    for device in devices:
        print(
            f"mac: {device.addr}; rssi: {device.rssi}; connectable: {device.connectable}")


def main():
    while True:
        scan_devices()


@app.route('/sensorData', methods=['GET'])
def get_sensor_data():
    last_scan = scans[len(scans)]
    previous_scan = scans[len(scans)-1]
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


if __name__ == "__main__":
    app.run(host=HOST, port=PORT)
    main()
