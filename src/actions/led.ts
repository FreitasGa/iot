import { z } from "zod";
import { emitter, mqtt, prisma } from "../modules";
import { LED_TOPIC } from "../app";

const schema = z.object({
  state: z.boolean(),
});

type LedPayload = z.infer<typeof schema>;

export async function led(payload: LedPayload) {
  schema.parse(payload);

  const device = await prisma.device.findFirst({
    where: {
      name: "led",
    },
  });

  if (!device) {
    return;
  }

  const data = {
    code: device.code,
    value: payload.state ? 1 : 0,
  };

  mqtt.publish(LED_TOPIC, JSON.stringify(data));
}
