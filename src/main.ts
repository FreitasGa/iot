import dotenv from "dotenv";
import { Application } from "./app";

dotenv.config();

async function main() {
  try {
    const app = new Application();
    await app.start();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

main();
