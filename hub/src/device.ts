import { Distance } from "./distance";
import { NotEnoughSignals } from "./errors/notEnoughSignals";
import { LotStraight } from "./lotStraight";
import { Position } from "./position";
import { RecivingModules } from "./recivingModules";

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
    console.info("Current Signals", this.signals)
    return Object.keys(this.signals).length >= this.minSignals;
  }

  getPosition(): Position {
    let straights = [];
    this.cleanSignals();
    if (!this.isValid()) {
      throw new NotEnoughSignals("Not enought signals for calculation");
    }
    console.log("calculation position for device", this.macAddress)
    const modules = this.recivingModules.getModules()
    let recivingModules = Object.keys(this.signals)
    while (recivingModules.length > 1) {
      const startModule = recivingModules.pop()
      console.log("set Startmodule", startModule)
      if (startModule == undefined) {
        console.error("startModule is not defined")
        throw new Error} // this is just for just for typescript syntax - startModule will not be undefined, caused by the while condition
      const RSSIStart = this.signals[startModule].currentRssi
      console.log("start RSSI", RSSIStart)
      for (const index in recivingModules) {
        const module = recivingModules[index]
        console.log(this.signals[module])
        const RSSIEnd = this.signals[module].currentRssi
        const signalRelation = RSSIStart / RSSIEnd
        console.log(modules[startModule], modules[module])
        const distance = new Distance(modules[startModule], modules[module]); 
        const lotPoint = distance.partialPoint(signalRelation)
        const gradient = distance.getGradient();
        straights.push(new LotStraight(gradient, lotPoint))
      }
    }
    // TODO Update Calculation to use all straights
    console.log("calculated Straights", straights)
    return straights[0].getIntersection(straights[1]);
  }
}
