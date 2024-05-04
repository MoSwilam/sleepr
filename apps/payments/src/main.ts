import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URI')],
      noAck: false, // We want to ack messages manually
      queue: 'payments_queue',
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  console.log(
    `------------ Payments App is running on: ${configService.get(
      'PORT',
    )} ------------`,
  );
}
bootstrap();
