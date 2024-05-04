import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URI')],
      queue: 'notifications_queue',
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  console.log(
    `------------ Notifications App is running on: ${configService.get(
      'PORT',
    )} ------------`,
  );
}
bootstrap();
