import { Inject, Injectable } from '@nestjs/common';
import { CreateClientDTO } from '@/presentation/client/dtos/create.client.dto';
import {
  CLIENT_REPOSITORY,
  CLIENT_REPOSITORY_BASE,
} from '@/infrastructure/constants/repositories.constants';
import { IClientRepository } from '@/domain/interfaces/iclient.repository';
import { ClientFactory } from '@/domain/factories/client.factory';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { IBaseRepository, ClientEntity, ClientMapper } from '@/domain';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(CLIENT_REPOSITORY_BASE)
    private readonly clientBaseRepository: IBaseRepository<ClientEntity>,
  ) {}

  async execute(data: CreateClientDTO) {
    const newClient = await this.createClient(data);
    return ClientMapper.toResponse(newClient);
  }

  private async createClient(data: CreateClientDTO) {
    try {
      const clientData = ClientFactory.create({
        user_id: data.user_id,
        name: data.name,
        salary: data.salary,
        company_value: data.company_value,
      });

      return await this.clientBaseRepository.create(clientData);
    } catch {
      throw new Exception('CLIENT_INVALID_INPUT');
    }
  }
}
