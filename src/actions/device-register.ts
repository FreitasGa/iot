import { prisma } from "../main";

type DeviceRegisterPayload = {
  code: string;
  name: string;
  location: string;
}

export async function deviceRegister(payload: DeviceRegisterPayload) {
  console.log("device.register");

  try {
    await prisma.device.upsert({
      where: {
        code: payload.code
      },
      create: {
        code: payload.code,
        name: payload.name,
        location: payload.location,
        state: "OFF",
      },
      update: {
        name: payload.name,
        location: payload.location,
      }
    })
  } catch (err) {
    console.error(err);
    throw err;
  }
}
