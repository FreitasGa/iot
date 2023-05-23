import { State } from "@prisma/client";
import { z } from "zod";

import { prisma } from "../modules";

const schema = z.object({
  code: z.string(),
  name: z.string(),
  location: z.string(),
  state: z.enum([State.ON, State.OFF]),
});

type DeviceRegisterPayload = z.infer<typeof schema>;

export async function deviceRegister(payload: DeviceRegisterPayload) {
  const action = "device.register";

  console.info(action);
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
