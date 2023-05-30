import MQTT from "mqtt";
export const mqtt = MQTT.connect('mqtts://pelxaqsb:pelxaqsb:qxVHTlGUoDZ2csC7ejikmlmHFywHH25d@jackal.rmq.cloudamqp.com');

mqtt.on("connect", () => console.info("MQTT connected"));

mqtt.on("disconnect", () => {
  console.error("MQTT disconnected");

  mqtt.reconnect();
});
