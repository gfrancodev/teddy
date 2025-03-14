import { Inject, Injectable } from '@nestjs/common';
import { IBaseRepository, ClientEntity, ClientMapper } from '@/domain';
import { CLIENT_REPOSITORY_BASE } from '@/infrastructure/constants/repositories.constants';
import { Exception } from '@/infrastructure/exception/builder/exception';

@Injectable()
export class GetByIdClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY_BASE)
    private readonly clientRepository: IBaseRepository<ClientEntity>,
  ) {}

  async execute(clientId: string) {
    const client = await this.findClient(clientId);
    return ClientMapper.toResponse(client);
  }

  private async findClient(clientId: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      throw new Exception('CLIENT_NOT_FOUND');
    }

    return client;
  }
}
