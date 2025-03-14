import { Inject, Injectable } from '@nestjs/common';
import { GetAllClientDTO } from '@/presentation/client/dtos/get-all.client.dto';
import { CLIENT_REPOSITORY } from '@/infrastructure/constants/repositories.constants';
import { IClientRepository } from '@/domain/interfaces/iclient.repository';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { ClientMapper } from '@/domain/mappers/client.mapper';
import { Roles } from '@/domain';

@Injectable()
export class GetAllClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(data: GetAllClientDTO, userRole: string) {
    try {
      const options = this.mountFilter(data, userRole);
      const result = await this.clientRepository.findAll(options);

      return ClientMapper.toPaginatedResponse(result);
    } catch {
      throw new Exception('INTERNAL_DATABASE_ERROR');
    }
  }

  mountFilter(data: GetAllClientDTO, userRole: string) {
    let userId = data.user_id;
    if (userRole === Roles.ADMIN) {
      userId = undefined;
    }
    return {
      filter: data.filter,
      current_page: data.current_page || 1,
      limit: data.limit || 16,
      user_id: userId,
    };
  }
}
