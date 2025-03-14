import { ClientEntity } from '../entities/client.entity';
import { Status } from '../enum/status.enum';
import { ClientMapper } from '../mappers/client.mapper';

export class ClientFactory {
  static create(data: Partial<ClientEntity>) {
    const client = new ClientEntity({
      user_id: data?.user_id,
      name: data?.name,
      salary: data?.salary,
      company_value: data.company_value,
      status: data?.status || ('active' as Status),
      created_at: data?.created_at || Date.now(),
      updated_at: data?.updated_at || Date.now(),
      deleted_at: data?.deleted_at || null,
    });

    return ClientMapper.toPersistence(client);
  }

  static update(client: ClientEntity, data: Partial<ClientEntity>) {
    const updatedClient = new ClientEntity({
      ...client,
      ...data,
      updated_at: Date.now(),
    });

    const { id, ...rest } = ClientMapper.toPersistence(updatedClient);
    return {
      id,
      data: rest,
    };
  }

  static delete(client: ClientEntity) {
    const deletedClient = new ClientEntity({
      ...client,
      status: 'deleted' as Status,
      deleted_at: Date.now(),
    });

    const { id, ...rest } = ClientMapper.toPersistence(deletedClient);
    return {
      id,
      data: rest,
    };
  }
}
