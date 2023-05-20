import { State } from "@prisma/client";
import { z } from "zod";

import { logger, prisma } from "../modules";

const schema = z.object({
  code: z.string(),
  name: z.string(),
  location: z.string(),
  state: z.enum([State.ON, State.OFF]),
});

type DeviceRegisterPayload = z.infer<typeof schema>;

export async function deviceRegister(payload: DeviceRegisterPayload) {
  logger.info("device.register");

  schema.parse(payload);

  await prisma.device.create({
    data: {
      code: payload.code,
      name: payload.name,
      location: payload.location,
      state: payload.state,
    },
  });
}
