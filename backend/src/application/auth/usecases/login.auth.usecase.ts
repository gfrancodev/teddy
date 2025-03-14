import { Inject, Injectable } from '@nestjs/common';
import { LoginAuthDTO } from '@/presentation/auth/dtos/login.auth.dto';
import { USER_REPOSITORY } from '@/infrastructure/constants/repositories.constants';
import { IUserRepository } from '@/domain/interfaces/iuser.repository';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { compareHash } from '@/infrastructure/helpers/hash.helper';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@/domain/entities/user.entity';
import { Status } from '@/domain/enum/status.enum';
import { AuthMapper } from '@/domain/mappers/auth.mapper';

@Injectable()
export class LoginAuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: LoginAuthDTO) {
    const user = await this.findUserByIdentifier(data.identifier);
    await this.validateUserStatus(user);
    await this.validatePassword(data.password, user.password);
    const accessToken = this.generateToken(user);
    return AuthMapper.toLoginResponse(user, accessToken);
  }

  private async findUserByIdentifier(identifier: string): Promise<UserEntity> {
    const user = await this.userRepository.findUserByIdentifier(identifier);
    if (!user) {
      throw new Exception('AUTH_INVALID_CREDENTIALS');
    }
    return user;
  }

  private async validateUserStatus(user: UserEntity): Promise<void> {
    if (user.status !== Status.ACTIVE) {
      throw new Exception('USER_INACTIVE', {
        status: user.status,
      });
    }
  }

  private async validatePassword(
    providedPassword: string,
    storedPassword: string,
  ): Promise<void> {
    try {
      const isPasswordValid = await compareHash(
        providedPassword,
        storedPassword,
      );
      if (!isPasswordValid) {
        throw new Exception('AUTH_INVALID_CREDENTIALS');
      }
    } catch {
      throw new Exception('AUTH_INVALID_CREDENTIALS');
    }
  }

  private generateToken(user: UserEntity) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
