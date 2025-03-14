import { Repository, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseRepository } from '../../domain/interfaces/ibase.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(entity: Partial<T>): Promise<T> {
    try {
      return await this.repository.save(entity as DeepPartial<T>);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string | number, entity: Partial<T>): Promise<T> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set(entity as QueryDeepPartialEntity<T>)
      .where('id = :id', { id })
      .execute();
    return this.findById(id);
  }

  async updateOne(filter: Partial<T>, entity: Partial<T>): Promise<T | null> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set(entity as QueryDeepPartialEntity<T>)
      .where(filter)
      .execute();
    return await this.findOne(filter as Partial<T>);
  }

  async delete(id: string | number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findOne(options: Partial<T>): Promise<T | null> {
    return await this.repository.findOne({
      where: options as FindOptionsWhere<T>,
    });
  }

  async findById(id: string | number): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }
}

export function createBaseRepository<T>(
  entity: Type<T>,
): Type<BaseRepository<T>> {
  @Injectable()
  class CustomBaseRepository extends BaseRepository<T> {
    constructor(@InjectRepository(entity) repository: Repository<T>) {
      super(repository);
    }
  }

  Object.defineProperty(CustomBaseRepository, 'name', {
    value: `${entity.name}BaseRepository`,
  });
  return CustomBaseRepository;
}
