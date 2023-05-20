import { PrismaClient } from '@prisma/client';
import amqplib from 'amqplib';
import dotenv from 'dotenv';
import EventEmitter2 from 'eventemitter2';

import { deviceRegister } from './actions/device-register';

dotenv.config();

export const prisma = new PrismaClient();
export const emitter = new EventEmitter2({
  wildcard: true,
});

emitter.on("device.register", deviceRegister);

async function main() {
  const MQTT_URL = process.env.MQTT_URL || '';
  const QUEUE = 'iot';

  try {
    await prisma.$connect();

    const connection = await amqplib.connect(MQTT_URL);
    const listener = await connection.createChannel();
    await listener.assertQueue(QUEUE);

    listener.consume(QUEUE, (message) => {
      if (!message) {
        console.log('No message');
        throw new Error('No message');
      }

      const headers = message.properties.headers;
      const action = headers.action;
      const payload = JSON.parse(message.content.toString());

      console.info('Message received', {
        action,
        payload,
      });

      emitter.emit(action, payload);
      listener.ack(message);
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

main();
