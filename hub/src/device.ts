import { Position } from "./position";
import { RecivingModules } from "./RecivingModules";

interface Signal {
  time: {
    start: string;
    end: string;
  };
  isConnectable: boolean;
  currentRssi: number;
  difference: number | null;
  average_offset: number | null;
}

interface Signals {
  [key: string]: Signal;
}

export class Device {
  public macAddress: string;
  protected signals: Signals;
  protected recivingModules: RecivingModules;
  protected maxValidTime: number; // seconds
  protected minSignals: number;

  constructor(macAddress: string) {
    this.macAddress = macAddress;
    this.recivingModules = new RecivingModules();
    this.maxValidTime = 5; // seconds
    this.minSignals = 3;
    this.signals = {};
  }

  updateSignals(recivingModuleId: string, signal: Signal) {
    this.signals[recivingModuleId] = signal;
  }

  cleanSignals() {
    // This function is removing outdatet signals
    const currentTime = new Date();
    for (const signal_ in this.signals) {
      const signal = this.signals[signal_];
      const endtime = new Date(signal.time.end);
      let validateionTime = new Date();
      validateionTime.setSeconds(endtime.getSeconds() + this.maxValidTime);
      if (validateionTime > currentTime) {
        delete this.signals[signal_];
      }
    }
  }

  isValid(): boolean {
    // checks if enough signals are available
    return Object.keys(this.signals).length >= this.minSignals;
    Object
  }

  getPosition(): Position {
    this.cleanSignals();
    if (!this.isValid()) {
      throw new Error("Not enough valid signals");
    }
    const modules = this.recivingModules.getModules()
    // TODO
    return new Position(0, 0);
  }
}
