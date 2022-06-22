import { Device } from "./device";
import { NotEnoughsignals } from "./errors/notEnoughSignals";
import { Position } from "./position";

interface DevicePositions {
    [key: string]: Position;
}

interface MQTTMessage {
    "client_id": string,
    "time": {
        "start": string
        "end": string
    },
    "signals": Array<{
        "device_id": string,
        "is_connectable": boolean,
        "current_rssi": number,
        "difference": number | null,
        "average_offset": number | null,
    }>
}


export class DeviceHandler {
    protected devices: {[key: string]: Device};

    constructor() {
        this.devices = {};
    }

    getPositions(): DevicePositions {
        let out: DevicePositions = {}
        for (const device_ in this.devices) {
            const device = this.devices[device_]
            try {
                out[device.macAddress] = device.getPosition()
            }
            catch (NotEnoughsignals) {
                console.error("Not enough Signals for device", device.macAddress)
            }
        }
        return out;
    }

    setSignals(msg: MQTTMessage) {
        for (const signal_ in msg.signals) {
            const signal = msg.signals[signal_]
            if (this.devices[signal.device_id] == undefined) {
                this.devices[signal.device_id] = new Device(signal.device_id)
            }
            let device = this.devices[signal.device_id];
            device.updateSignals(msg.client_id , {
                "time": {
                    "start": msg.time.start,
                    "end": msg.time.end,
                },
                "isConnectable": signal.is_connectable,
                "currentRssi": signal.current_rssi,
                "difference": signal.difference,
                "average_offset": signal.average_offset,
            });
        }
    }
}

