import { Action, actionSchema, deviceRegister, deviceUpdate } from "./actions";
import { emitter, mqtt } from "./modules";

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

    mqtt.subscribe(this.topic, (err) => {
      if (err) {
        throw err;
      }

      console.info(this.topic, "MQTT subscribed");
    });

    mqtt.on("message", (topic, message) => {
      console.log("message", message.toString());
      const { action, payload } = JSON.parse(message.toString());

      if (!action || !payload) {
        console.error("MQTT action or payload is not defined");
        return;
      }

      if (!actionSchema.safeParse(action).success) {
        console.error("MQTT action is not valid");
        return;
      }

      console.info(
        {
          topic,
          action,
          payload,
        },
        "MQTT message received"
      );

      emitter.emit(action, payload);
    });
  }
}
