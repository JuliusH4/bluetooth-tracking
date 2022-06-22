import express from "express";
import * as mqtt from "mqtt";

import { DeviceHandler } from "./deviceHandler"
import { Position } from "./position";
import { RecivingModules } from "./recivingModules";

const MQTT_ADDRESS = "mqtt://127.0.0.1";
const MQTT_TOPIC = "/btt/sensorData";
const PORT = 3000;

const client: mqtt.MqttClient = mqtt.connect(MQTT_ADDRESS);
const app = express();

let deviceHandler = new DeviceHandler();

client.on("connect", () => {
  console.log("MQTT Client Connected");
  client.subscribe(MQTT_TOPIC, (err: any) => {
    if (!err) {
      console.log(`subscribed to channel ${MQTT_TOPIC}`);
    }
  });
});

client.on("message", (topic: string, message_: Buffer) => {
  const message_str = message_.toString().replace(/'/g, '"')
  const message = JSON.parse(message_str)
  console.info("recived MQTT message", topic, message);
  deviceHandler.setSignals(message);
});

interface Query {
  macAddress: string;
  xOffset: number;
  yOffset: number;
};

app.post("/sensor", (req, res) => {
  const query = req.query as unknown as Query;
  console.log(query)
  const rm = new RecivingModules
  const position = new Position(query.xOffset, query.yOffset)
  rm.setModule(query.macAddress, position)
  res.send("Success");
});

app.get("/positions", (req, res) => {
  const positions = deviceHandler.getPositions();
  res.send(positions);
});

app.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
});
