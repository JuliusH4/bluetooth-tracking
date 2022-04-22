from bluepy import btle

scanner = btle.Scanner()

def get_rssi(device):
    return device.rssi

def scan_devices(intervall: float = 5):
    devices = list(scanner.scan(intervall))
    print(f"Found {len(devices)} devices:")
    devices.sort(key=get_rssi, reverse=True)
    for device in devices:
        print(f"mac: {device.addr}; rssi: {device.rssi}")

def main():
    while True:
        scan_devices(1)

if __name__ == "__main__":
    main()
