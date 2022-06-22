// import crypto from 'crypto';
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
      if (err) {
        console.error("Error while reading Moduledata")
        throw err;
      }
      const modules = JSON.parse(data);
      console.log("Read Reciving Module Data", modules);
      for (const module_ in modules) {
        const module = modules[module_]
        console.log(module)
        out[module.id] = new Position(module.x, module.y);
      }
    });
    // only debugging
    const pos1 = new Position(50,130)
    const pos2 = new Position(150,0)
    const pos3 = new Position(0,10)
    return {"b8:27:eb:bb:5b:dd": pos1, "b8:27:eb:af:d0:0a": pos2, "b8:27:eb:13:ac:fe": pos3};
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
