import mqtt from "mqtt";

import { Action, deviceRegister, deviceUpdate } from "./actions";
import { emitter, logger, prisma } from "./modules";

export class Application {
  private mqtt?: mqtt.Client;

  async setup() {
    emitter.on(Action.DEVICE_REGISTER, deviceRegister);
    emitter.on(Action.DEVICE_UPDATE, deviceUpdate);
  }

  async connect() {
    const mqttURL = process.env.MQTT_URL;
    const mqttTopic = process.env.MQTT_TOPIC;

    if (!mqttURL || !mqttTopic) {
      throw new Error("MQTT url or topic is not defined");
    }

    await prisma.$connect();
    this.mqtt = mqtt.connect(mqttURL);

    this.mqtt.on("connect", () => logger.info("MQTT connected"));
    
    this.mqtt.on("disconnect", () => {
      logger.info("MQTT disconnected");

      this.mqtt?.reconnect();
    });

    this.mqtt.subscribe(mqttTopic, (err) => {
      if (err) {
        throw err;
      }

      logger.info(mqttTopic, "MQTT subscribed");
    });
  }

  async start() {
    await this.setup();
    await this.connect();

    if (!this.mqtt) {
      throw new Error("MQTT is not connected");
    }

    this.mqtt.on("message", (topic, message) => {
      const { action, payload } = JSON.parse(message.toString());

      if (!action || !payload) {
        throw new Error("MQTT action or payload is not defined");
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
