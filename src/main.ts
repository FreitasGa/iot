import dotenv from "dotenv";
import { Application } from "./app";

dotenv.config();

async function main() {
  try {
    if (!process.env.DATABASE_URL || !process.env.MQTT_URL) {
      throw new Error("Environment variables are not defined");
    }

    const app = new Application();
  
    await app.start();

  } catch (err) {
    console.error(err);
    throw err;
  }
}

main();
