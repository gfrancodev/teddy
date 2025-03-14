import { Inject, Injectable } from '@nestjs/common';
import { IBaseRepository, UserEntity, UserMapper } from '@/domain';
import { USER_REPOSITORY_BASE } from '@/infrastructure/constants/repositories.constants';
import { Exception } from '@/infrastructure/exception/builder/exception';

@Injectable()
export class MeAuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY_BASE)
    private readonly userBaseRepository: IBaseRepository<UserEntity>,
  ) {}

  async execute(userId: string) {
    const user = await this.findUser(userId);
    return UserMapper.toResponse(user);
  }

  private async findUser(userId: string): Promise<UserEntity> {
    const user = await this.userBaseRepository.findById(userId);
    if (!user) {
      throw new Exception('USER_NOT_FOUND');
    }
    return user;
  }
}
