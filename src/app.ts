import MQTT from "mqtt";

import { Action, actionSchema, deviceRegister, deviceUpdate } from "./actions";
import { emitter, logger } from "./modules";

export class Application {
  private mqtt: MQTT.MqttClient;

  constructor() {
    if (!process.env.MQTT_URL) {
      throw new Error("MQTT url is not defined");
    }

    this.mqtt = MQTT.connect(process.env.MQTT_URL);
  }

  private actions() {
    emitter.on(Action.DEVICE_REGISTER, deviceRegister);
    emitter.on(Action.DEVICE_UPDATE, deviceUpdate);
  }

  async start() {
    this.actions();

    if (!process.env.MQTT_TOPIC) {
      throw new Error("MQTT topic is not defined");
    }

    this.mqtt.on("connect", () => logger.info("MQTT connected"));

    this.mqtt.on("disconnect", () => {
      logger.error("MQTT disconnected");

      this.mqtt.reconnect();
    });

    this.mqtt.subscribe(process.env.MQTT_TOPIC, (err) => {
      if (err) {
        throw err;
      }

      logger.info(process.env.MQTT_TOPIC, "MQTT subscribed");
    });

    this.mqtt.on("message", (topic, message) => {
      const { action, payload } = JSON.parse(message.toString());

      if (!action || !payload) {
        logger.error("MQTT action or payload is not defined");
        return;
      }

      if (!actionSchema.safeParse(action).success) {
        logger.error("MQTT action is not valid");
        return;
      }

      logger.info(
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
