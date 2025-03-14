import { Inject, Injectable } from '@nestjs/common';
import { UpdateClientDTO } from '@/presentation/client/dtos/update.client.dto';
import { CLIENT_REPOSITORY_BASE } from '@/infrastructure/constants/repositories.constants';
import { ClientFactory } from '@/domain/factories/client.factory';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { IBaseRepository, ClientEntity } from '@/domain';

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY_BASE)
    private readonly clientBaseRepository: IBaseRepository<ClientEntity>,
  ) {}

  async execute(id: number, data: UpdateClientDTO) {
    const client = await this.findClient(id);
    return await this.updateClient(client, data);
  }

  private async findClient(id: number): Promise<ClientEntity> {
    const client = await this.clientBaseRepository.findById(id);
    if (!client) {
      throw new Exception('CLIENT_NOT_FOUND');
    }
    return client;
  }

  private async updateClient(
    client: ClientEntity,
    data: UpdateClientDTO,
  ): Promise<void> {
    try {
      const { id, data: updateData } = ClientFactory.update(client, data);
      await this.clientBaseRepository.update(id, updateData);
    } catch {
      throw new Exception('CLIENT_INVALID_INPUT');
    }
  }
}
