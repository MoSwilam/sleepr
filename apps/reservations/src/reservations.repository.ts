import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './models/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReservationRepo extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationRepo.name);

  constructor(
    @InjectRepository(Reservation)
    reservationRepo: Repository<Reservation>,
    entityManager: EntityManager,
  ) {
    super(reservationRepo, entityManager);
  }
}
