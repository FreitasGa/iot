import { z } from "zod";
import { prisma } from "../modules";

const schema = z.object({
  id: z.string(),
  position: z.string(),
  devices: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
    })
  ),
});

type DeviceRegisterPayload = z.infer<typeof schema>;

export async function devices(payload: DeviceRegisterPayload) {
  schema.parse(payload);

  const devices = await prisma.device.findMany({
    where: {
      code: {
        in: payload.devices.map((device) => device.code),
      }
    }
  })

  if (devices.length > 0) {
    return;
  }

  await prisma.device.createMany({
    data: payload.devices.map((device) => ({
      code: device.code,
      name: device.name,
      position: payload.position,
    })),
  });
}
