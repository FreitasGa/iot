import { devices, ldr, led } from "./actions";
import { emitter, mqtt } from "./modules";

export const LDR_TOPIC = "ldr";
export const LED_TOPIC = "led";
export const DEVICES_TOPIC = "devices";

export class Application {
  private actions() {
    emitter.on(LDR_TOPIC, ldr);
    emitter.on(LED_TOPIC, led);
    emitter.on(DEVICES_TOPIC, devices);
  }

  async start() {
    this.actions();

    mqtt.subscribe(DEVICES_TOPIC, (err) => {
      if (err) {
        throw err;
      }

      console.info("MQTT subscribed", DEVICES_TOPIC);
    });

    mqtt.subscribe(LDR_TOPIC, (err) => {
      if (err) {
        throw err;
      }

      console.info("MQTT subscribed", LDR_TOPIC);
    });

    mqtt.on("message", (topic, message) => {
      console.log("Message", message.toString());

      const payload = JSON.parse(message.toString());

      if (!payload) {
        console.error("MQTT payload is not defined");
        return;
      }

      console.info("MQTT message received", {
        topic,
        payload,
      });

      emitter.emit(topic, payload);
    });
  }
}
