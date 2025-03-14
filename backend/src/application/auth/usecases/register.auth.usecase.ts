import { Inject, Injectable } from '@nestjs/common';
import { RegisterAuthDTO } from '@/presentation/auth/dtos/register.auth.dto';
import {
  USER_REPOSITORY,
  USER_REPOSITORY_BASE,
} from '@/infrastructure/constants/repositories.constants';
import { IUserRepository } from '@/domain/interfaces/iuser.repository';
import { UserFactory } from '@/domain/factories/user.factory';
import { generateHash } from '@/infrastructure/helpers/hash.helper';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { IBaseRepository, UserEntity } from '@/domain';

@Injectable()
export class RegisterAuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(USER_REPOSITORY_BASE)
    private readonly userBaseRepository: IBaseRepository<UserEntity>,
  ) {}

  async execute(data: RegisterAuthDTO): Promise<void> {
    await this.validateUniqueIdentifiers(data);
    const hashedPassword = await this.hashPassword(data.password);
    await this.createUser({ ...data, password: hashedPassword });
  }

  private async validateUniqueIdentifiers(
    data: RegisterAuthDTO,
  ): Promise<void> {
    const [userByEmail, userByUsername] = await Promise.all([
      this.userRepository.findUserByIdentifier(data.email),
      this.userRepository.findUserByIdentifier(data.username),
    ]);

    if (userByEmail) {
      throw new Exception('USER_EMAIL_ALREADY_EXISTS');
    }

    if (userByUsername) {
      throw new Exception('USER_USERNAME_ALREADY_EXISTS', {
        username: data.username,
      });
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await generateHash(password);
    } catch {
      throw new Exception('AUTH_PASSWORD_HASH_FAILED');
    }
  }

  private async createUser(
    data: RegisterAuthDTO & { password: string },
  ): Promise<void> {
    try {
      const userData = UserFactory.create({
        fullname: data.fullname,
        email: data.email,
        username: data.username,
        password: data.password,
      });
      await this.userBaseRepository.create(userData);
    } catch {
      throw new Exception('AUTH_REGISTRATION_FAILED');
    }
  }
}
