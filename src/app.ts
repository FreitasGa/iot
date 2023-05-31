import { Action, actionSchema, deviceRegister, deviceUpdate } from "./actions";
import { emitter, mqtt } from "./modules";
import { WebSocketServer } from "ws";
export class Application {
  constructor() {}

  private actions() {
    emitter.on(Action.DEVICE_REGISTER, deviceRegister);
    emitter.on(Action.DEVICE_UPDATE, deviceUpdate);
  }

  async start() {
    this.actions();

    const wss = new WebSocketServer({ port: 8080 });

    mqtt.subscribe(process.env.MQTT_LED_TOPIC!, (err) => {

      if (err) {
        throw err;
      }
    });

    wss.on("connection", (socket) => {
      mqtt.on("message", (topic, message) => {
        const { code, value } = JSON.parse(message.toString());

        console.info(
          {
            topic,
            code,
            value,
          },
          "MQTT message received"
        );

        socket.send(JSON.stringify({ code, value }));
      });
    });
  }
}
