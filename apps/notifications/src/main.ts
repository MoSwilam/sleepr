import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { NOTIFICATION_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: configService.getOrThrow<string>('NOTIFICATIONS_GRPC_URL'),
      package: NOTIFICATION_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/notifications.proto'),
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
