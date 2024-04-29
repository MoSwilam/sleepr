import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { IUserDto, PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { ReservationRepo } from './reservations.repository';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationRepo,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: IUserDto,
  ) {
    return this.paymentsClient
      .send('create_charge', { ...createReservationDto.charge, email })
      .pipe(
        map((res) => {
          const reservation = new Reservation({
            ...createReservationDto,
            timestamp: new Date(),
            invoiceId: res.id,
            userId,
          });
          // console.log({ location: 'ReservationsService.create.subscribe' });
          return this.reservationsRepository.create(reservation);
        }),
      );
  }

  async findAll(userId: number) {
    return this.reservationsRepository.find({ userId });
  }

  async findOne(id: number) {
    return this.reservationsRepository.findOne({ id });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto
    );
  }

  async remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({ id });
  }
}
