import { z } from "zod";

export enum Action {
  DEVICE_REGISTER = "device.register",
  DEVICE_UPDATE = "device.update",
}

export const actionSchema = z.enum([
  Action.DEVICE_REGISTER,
  Action.DEVICE_UPDATE,
]);
