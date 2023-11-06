import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto) {
    return await this.userRepository.create({
      ...data,
      password: await bcrypt.hash(data.password, 10)
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
