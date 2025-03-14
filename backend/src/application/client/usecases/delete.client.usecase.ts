import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY_BASE } from '@/infrastructure/constants/repositories.constants';
import { ClientFactory } from '@/domain/factories/client.factory';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { IBaseRepository, ClientEntity } from '@/domain';

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY_BASE)
    private readonly clientBaseRepository: IBaseRepository<ClientEntity>,
  ) {}

  async execute(id: number): Promise<void> {
    const client = await this.findClient(id);
    await this.deleteClient(client);
  }

  private async findClient(id: number): Promise<ClientEntity> {
    const client = await this.clientBaseRepository.findById(id);
    if (!client) {
      throw new Exception('CLIENT_NOT_FOUND');
    }
    return client;
  }

  private async deleteClient(client: ClientEntity): Promise<void> {
    try {
      const { id, data } = ClientFactory.delete(client);
      await this.clientBaseRepository.update(id, data);
    } catch {
      throw new Exception('INTERNAL_DATABASE_ERROR');
    }
  }
}
