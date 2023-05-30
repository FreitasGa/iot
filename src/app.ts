import { Action, actionSchema, deviceRegister, deviceUpdate } from "./actions";
import { emitter, mqtt } from "./modules";
import { WebSocketServer } from "ws";
export class Application {
  private readonly topic: string;

  constructor() {
    this.topic = process.env.MQTT_TOPIC_SUB!;
  }

  private actions() {
    emitter.on(Action.DEVICE_REGISTER, deviceRegister);
    emitter.on(Action.DEVICE_UPDATE, deviceUpdate);
  }

  async start() {
    this.actions();

    const wss = new WebSocketServer({ port: 8080 });

    mqtt.subscribe("ldr", (err) => {
      if (err) {
        throw err;
      }
    });

    wss.on("connection", (socket) => {
      console.log("connected");

      mqtt.on("message", (topic, message) => {
        const { deviceName, value } = JSON.parse(message.toString());

        console.info(
          {
            topic,
            deviceName,
            value,
          },
          "MQTT message received"
        );

        socket.send(JSON.stringify({ deviceName, value }));
      });
    });
  }
}
