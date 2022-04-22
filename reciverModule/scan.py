from bluepy import btle
import os
from datetime import datetime

scanner = btle.Scanner()

def scan_devices(intervall: float = 5, minRssiValue: int = -80):
    starttime = datetime.utcnow()
    devices = list(scanner.scan(intervall))
    endtime = datetime.utcnow()
    print(f"start: {starttime}, end: {endtime}")
    print(f"Found {len(devices)} devices:")
    devices.sort(key=lambda device : device.rssi, reverse=True)
    for device in devices:
        if device.rssi < minRssiValue:
            break
        print(f"mac: {device.addr}; rssi: {device.rssi}; connectable: {device.connectable}")

def main():
    MAC_ADRESS = os.popen("sudo cat /sys/kernel/debug/bluetooth/hci0/identity").read().split(' ')[0]
    print(f"This mac adress: {MAC_ADRESS}")
    while True:
        scan_devices()

if __name__ == "__main__":
    main()
