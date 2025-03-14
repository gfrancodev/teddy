import generateUUIDv7 from '@/infrastructure/helpers/generate-uuidv7.helper';
import { UserEntity } from '../entities/user.entity';
import { Roles } from '../enum/role.enum';
import { Status } from '../enum/status.enum';
import { UserMapper } from '../mappers/user.mapper';

export class UserFactory {
  static create(data: Partial<UserEntity>): Partial<UserEntity> {
    const user = new UserEntity({
      id: generateUUIDv7(),
      fullname: data?.fullname,
      email: data?.email,
      username: data?.username,
      last_access: data?.last_access || null,
      password: data?.password,
      status: data?.status || ('active' as Status),
      role: data?.role || ('user' as Roles),
      verified: data?.verified || false,
      created_at: data?.created_at || Date.now(),
      updated_at: data?.updated_at || Date.now(),
      deleted_at: data?.deleted_at || null,
    });

    return UserMapper.toPersistence(user);
  }

  static update(user: UserEntity, data: Partial<UserEntity>) {
    const updatedUser = new UserEntity({
      ...user,
      ...data,
      updated_at: Date.now(),
    });

    const { id, ...rest } = UserMapper.toPersistence(updatedUser);

    return {
      id,
      data: rest,
    };
  }

  static delete(user: UserEntity) {
    const deletedUser = new UserEntity({
      ...user,
      email: `${user.email}_${Date.now()}_DELETED`,
      username: `${user.username}_${Date.now()}_DELETED`,
      status: 'deleted' as Status,
      deleted_at: Date.now(),
    });

    const { id, ...rest } = UserMapper.toPersistence(deletedUser);

    return {
      id,
      data: rest,
    };
  }
}
