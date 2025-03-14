import { UserEntity } from '../entities/user.entity';

export class AuthMapper {
  static toLoginResponse(user: UserEntity, accessToken: string) {
    return {
      access_token: accessToken,
      expires_in: 3600,
      user: {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      },
    };
  }
}
