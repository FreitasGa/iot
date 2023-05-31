import { z } from "zod";
import { emitter, prisma } from "../modules";
import { LED_TOPIC } from "../app";

const schema = z.object({
  code: z.string(),
  value: z.number(),
});

type LdrPayload = z.infer<typeof schema>;

export async function ldr(payload: LdrPayload) {
  schema.parse(payload);

  const device = await prisma.device.findUnique({
    where: {
      code: payload.code,
    },
  });

  if (!device) {
    return;
  }

  emitter.emit(LED_TOPIC, {
    state: payload.value < 100,
  });
}
