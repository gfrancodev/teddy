import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientRepositoryEntity } from './entities/client.repository.entity';
import { Status } from '@/domain/enum/status.enum';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientRepositoryEntity)
    private readonly repository: Repository<ClientRepositoryEntity>,
  ) {}

  public async findAll(options: {
    filter?: string;
    current_page?: number;
    limit?: number;
    user_id?: string | null;
  }): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    limit: number;
    in_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    data: ClientRepositoryEntity[];
  }> {
    const page = options.current_page || 1;
    const limit = options.limit || 10;
    const sortByCreatedAt = 'DESC';
    const skip = (page - 1) * limit;

    const [data, total] = await this.getClientsWithPaginationAndFilter(
      options.filter,
      options.user_id,
      skip,
      limit,
      sortByCreatedAt,
    );

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      current_page: page,
      total_pages: totalPages,
      total_items: total,
      limit: limit,
      in_page: data.length,
      has_next_page: hasNextPage,
      has_previous_page: hasPreviousPage,
      data,
    };
  }

  protected async getClientsWithPaginationAndFilter(
    filter?: string,
    userId?: string | null,
    skip?: number,
    take?: number,
    sortByCreatedAt?: 'ASC' | 'DESC',
  ): Promise<[ClientRepositoryEntity[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('client')
      .where('client.status != :deletedStatus', {
        deletedStatus: Status.DELETED,
      });

    if (userId) {
      queryBuilder.andWhere('client.user_id = :userId', { userId });
    }

    if (filter) {
      queryBuilder.andWhere(
        '(client.name ILIKE :filter OR CAST(client.id AS TEXT) ILIKE :filter)',
        { filter: `%${filter}%` },
      );
    }
    return await queryBuilder
      .select([
        'client.id',
        'client.name',
        'client.salary',
        'client.company_value',
        'client.status',
        'client.created_at',
        'client.updated_at',
        'client.user_id',
      ])
      .orderBy('client.created_at', sortByCreatedAt)
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  public async findByName(
    name: string,
  ): Promise<ClientRepositoryEntity | null> {
    return this.repository.findOne({
      where: {
        name,
        status: Status.ACTIVE,
      },
    });
  }
}
