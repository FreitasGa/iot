import MQTT from "mqtt";
export const mqtt = MQTT.connect(process.env.MQTT_URL!);

mqtt.on("connect", () => console.info("MQTT connected"));

mqtt.on("disconnect", () => {
  console.error("MQTT disconnected");

  mqtt.reconnect();
});
