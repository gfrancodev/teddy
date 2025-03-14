import { ClientEntity } from '../entities/client.entity';
import { Status } from '../enum/status.enum';

export class ClientMapper {
  static toDomain(raw: any): ClientEntity {
    return new ClientEntity({
      id: raw?.id,
      user_id: raw?.user_id,
      name: raw?.name,
      salary: raw?.salary,
      company_value: raw?.company_value,
      status: raw?.status as Status,
      created_at: raw?.created_at,
      updated_at: raw?.updated_at,
      deleted_at: raw?.deleted_at,
    });
  }

  static toPersistence(data: Partial<ClientEntity>): Partial<ClientEntity> {
    return {
      id: data?.id,
      user_id: data?.user_id,
      name: data?.name,
      salary: data?.salary,
      company_value: data?.company_value,
      status: data?.status,
      created_at: data?.created_at,
      updated_at: data?.updated_at,
      deleted_at: data?.deleted_at,
    };
  }

  static toResponse(data: Partial<ClientEntity>) {
    return {
      id: data?.id,
      user_id: data?.user_id,
      name: data?.name,
      salary: data?.salary,
      company_value: data?.company_value,
      status: data?.status,
      created_at: data?.created_at
        ? new Date(data?.created_at * 1000).toISOString()
        : null,
      updated_at: data?.updated_at
        ? new Date(data?.updated_at * 1000).toISOString()
        : null,
      deleted_at: data?.deleted_at
        ? new Date(data?.deleted_at * 1000).toISOString()
        : null,
    };
  }

  static toPaginatedResponse(result: Global.PaginatedResult<ClientEntity>) {
    return {
      current_page: result?.current_page,
      total_pages: result?.total_pages,
      total_items: result.total_items,
      limit: result?.limit,
      in_page: result?.in_page,
      has_next_page: result?.has_next_page,
      has_previous_page: result?.has_previous_page,
      data: result.data.map((client) => this.toResponse(client)),
    };
  }
}
