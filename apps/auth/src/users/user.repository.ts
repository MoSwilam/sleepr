import { User } from '@app/common';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    userRepo: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(userRepo, entityManager);
  }
}
