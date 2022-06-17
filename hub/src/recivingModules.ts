import crypto from 'crypto';
import fs from 'fs';
import { Position } from './position';

interface Modules {
  [key: string]: Position
}

export class RecivingModules {
  protected path: string;

  constructor(path: string = "modules.json") {
    this.path = path;
  }

  getModules(): Modules {
    let out: Modules = {}
    fs.readFile(this.path, (err: any, data: any) => {
      if (err) throw err;
      const modules = JSON.parse(data);
      console.log("Read Recivin Module Data", modules);
      for (const module_ in modules) {
        const module = modules[module_]
        out[module.id] = new Position(module.x, module.y);
      }
    });
    return out;
  }

  setModule(macAddress: string, position: Position) {
    fs.readFile(this.path, 'utf8', (err: any, data: any) => {
      if (err) throw err;
      let obj = JSON.parse(data);
      obj[macAddress] = {"x": position.x, "y": position.y}
      const json = JSON.stringify(obj);
      fs.writeFile(this.path, json, 'utf8', () => {});
    });
  }

  /* currently not in use 
  getState(): string {
    const fileBuffer = fs.readFileSync(this.path);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } */

}
