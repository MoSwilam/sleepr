import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { IUser, PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: IUser,
  ) {
    return this.paymentsClient
      .send('create_charge', { ...createReservationDto.charge, email })
      .pipe(
        map((res) => {
          // console.log({ location: 'ReservationsService.create.subscribe' });
          return this.prismaService.reservations.create({
            data: {
              startDate: createReservationDto.startDate,
              endDate: createReservationDto.endDate,
              timeStamp: new Date(),
              invoiceId: res.id,
              userId,
            },
          });
        }),
      );
  }

  async findAll() {
    return this.prismaService.reservations.findMany({});
  }

  async findOne(id: number) {
    return this.prismaService.reservations.findUnique({ where: { id } });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservations.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.reservations.delete({ where: { id } });
  }
}
