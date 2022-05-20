import express from "express";
import * as mqtt from "mqtt";

const MQTT_ADDRESS = "";
const MQTT_TOPIC = "/btt/sensorData";

const client: mqtt.MqttClient = mqtt.connect(MQTT_ADDRESS);
const app = express();

client.on("connect", () => {
  console.log("MQTT Client Connected");
  client.subscribe(MQTT_TOPIC, (err: any) => {
    if (!err) {
      console.log(`subscribed to channel ${MQTT_TOPIC}`);
    }
  });
});

client.on("message", (topic: any, message: Buffer) => {
  // message is Buffer
  console.log(message.toString());
});

app.get("/sensor", (req, res) => {
  const params = req.params;
  res.send("Success");
});

app.get("/positions", (req, res) => {
  const positions = {
    MAC1: { x: 1, y: 5 },
    MAC2: { x: -2, y: 3 },
  };
  res.send(positions);
});

app.listen(3000, () => {
  console.log("The application is listening on port 3000!");
});
