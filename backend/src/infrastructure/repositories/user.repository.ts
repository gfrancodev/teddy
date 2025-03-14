import { IUserRepository } from '@/domain/interfaces/iuser.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryEntity } from './entities/user.repository.entity';
import { UserEntity } from '@/domain/entities/user.entity';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserRepositoryEntity)
    private readonly repository: Repository<UserRepositoryEntity>,
  ) {}

  async findUserByIdentifier(identifier: string): Promise<UserEntity> {
    return await this.repository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });
  }
}
