import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AUTH_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `${configService.get('AUTH_GRPC_URL')}`,
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/auth.proto'),
    },
  });

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Sleepr Auth API')
    .setDescription('Sleepr Auth API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${process.env.SWAGGER_URI}`, app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('HTTP_PORT'));
  console.log(
    `-------------==- Auth App is running on: ${configService.get(
      'HTTP_PORT',
    )} ------------`,
  );
}
bootstrap();
