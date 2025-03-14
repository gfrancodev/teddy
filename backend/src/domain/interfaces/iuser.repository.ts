import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findUserByIdentifier(identifier: string): Promise<UserEntity>;
}
