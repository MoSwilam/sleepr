import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Sleepr Reservations  API')
    .setDescription('Sleepr Reservations API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`/docs/reservations`, app, document);
  await app.listen(configService.get('PORT'));
  console.log(
    `------------ Reservations App is running on: ${configService.get(
      'PORT',
    )} ------------`,
  );
}
bootstrap();
