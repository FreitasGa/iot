import { State } from "@prisma/client";
import { z } from "zod";

import { logger, prisma } from "../modules";

const schema = z.object({
  code: z.string(),
  state: z.enum([State.ON, State.OFF]),
});

type DeviceUpdatePayload = z.infer<typeof schema>;

export async function deviceUpdate(payload: DeviceUpdatePayload) {
  logger.info("device.update");

  schema.parse(payload);

  await prisma.device.update({
    where: {
      code: payload.code,
    },
    data: {
      state: payload.state,
    },
  });
}
