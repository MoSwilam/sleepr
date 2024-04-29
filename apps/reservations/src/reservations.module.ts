import { Inject, Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
  DatabaseModule,
  HealthModule,
  LoggerModule,
  PAYMENTS_SERVICE,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';
import { Reservation } from './models/reservation.entity';
import { ReservationRepo } from './reservations.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepo],
  exports: [ReservationsService, ReservationRepo],
})
export class ReservationsModule {}
