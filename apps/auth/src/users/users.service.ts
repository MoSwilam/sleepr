import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto) {
    await this.validaUserDto(data);
    return await this.userRepository.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });
  }

  async validaUserDto(data: CreateUserDto) {
    const user = await this.userRepository.isDocumentExists({
      email: data.email,
    });
    if (user) {
      throw new UnprocessableEntityException('User already exists');
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getUser(query: GetUserDto) {
    return await this.userRepository.findOne(query);
  }
}
