import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(private readonly entityRepo: Repository<T>, private readonly entityManager: EntityManager) {}

  async create(entity: T): Promise<T> {
    console.log('-------------------- ABSTRACT REPOSITORY BEFORE SAVE -------------------');
    const savedEntity = await this.entityRepo.save(entity);
    console.log('-------------------- ABSTRACT REPOSITORY AFTER SAVE -------------------');
    return savedEntity;
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.entityRepo.findOne({ where });

    if (!entity) {
      this.logger.warn('Entity not found', where);
      throw new NotFoundException(`Entity was not found!`);
    }

    return entity;
  }

  async isDocumentExists(
    where: FindOptionsWhere<T>,
  ): Promise<boolean> {
    return !!(await this.findOne(where));
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    query: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.entityRepo.update(where, query); 

    if (!updateResult.affected) {
      this.logger.warn('Entity not found', where);
      throw new NotFoundException(`Entity was not found!`);
    }

    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.entityRepo.findBy(where);
  }

  async findOneAndDelete(
    where: FindOptionsWhere<T>
  ) {
    return this.entityRepo.delete(where);
  }
}
