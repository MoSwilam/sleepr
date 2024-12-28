import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async createUser(data: CreateUserDto) {
    await this.validaUserDto(data);
    return await this.prismaService.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      }
    });
  }

  async validaUserDto(data: CreateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: data.email, }
    });
    if (user) {
      throw new UnprocessableEntityException('User already exists');
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({ where: { email } });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getUser(query: GetUserDto) {
    return await this.prismaService.user.findUniqueOrThrow({ where: { id: +query.id } });
  }
}
