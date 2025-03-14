import { UserEntity } from '../entities/user.entity';
import { Roles } from '../enum/role.enum';
import { Status } from '../enum/status.enum';

export class UserMapper {
  static toDomain(raw: any): UserEntity {
    return new UserEntity({
      id: raw?.id,
      fullname: raw?.fullname,
      email: raw.email,
      username: raw?.username,
      last_access: raw?.last_access,
      password: raw?.password,
      status: raw?.status as Status,
      role: raw?.role as Roles,
      verified: raw?.verified,
      created_at: raw?.created_at,
      updated_at: raw?.updated_at,
      deleted_at: raw?.deleted_at,
    });
  }

  static toPersistence(data: Partial<UserEntity>): Partial<UserEntity> {
    return {
      fullname: data?.fullname,
      email: data?.email,
      username: data?.username,
      last_access: data?.last_access,
      password: data?.password,
      status: data?.status,
      role: data?.role,
      verified: data?.verified,
      created_at: data?.created_at,
      updated_at: data?.updated_at,
      deleted_at: data?.deleted_at,
    };
  }

  static toResponse(data: Partial<UserEntity>) {
    return {
      id: data?.id,
      fullname: data?.fullname,
      email: data?.email,
      username: data?.username,
      last_access: data?.last_access,
      status: data?.status,
      role: data?.role,
      verified: data?.verified,
      created_at: data?.created_at
        ? new Date(data?.created_at * 1000).toISOString()
        : null,
      updated_at: data?.updated_at
        ? new Date(data?.updated_at * 1000).toISOString()
        : null,
      deleted_at: data?.deleted_at
        ? new Date(data?.deleted_at * 1000).toISOString()
        : null,
    };
  }
}
