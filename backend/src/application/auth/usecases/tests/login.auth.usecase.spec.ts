import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginAuthUseCase } from '../login.auth.usecase';
import { JwtService } from '@nestjs/jwt';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { UserEntity } from '@/domain/entities/user.entity';
import { Status } from '@/domain/enum/status.enum';
import { Roles } from '@/domain/enum/role.enum';
import { Exception } from '@/infrastructure/exception/builder/exception';
import * as hashHelper from '@/infrastructure/helpers/hash.helper';
import { IUserRepository } from '@/domain/interfaces/iuser.repository';

describe('LoginAuthUseCase', () => {
  let useCase: LoginAuthUseCase;
  let userRepository: DeepMockProxy<IUserRepository>;
  let jwtService: DeepMockProxy<JwtService>;

  const mockUser: UserEntity = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Roles.USER,
    status: Status.ACTIVE,
    created_at: Date.now(),
    updated_at: Date.now(),
    fullname: 'Test User',
    last_access: Date.now(),
    verified: true,
    deleted_at: null,
  };

  beforeEach(() => {
    userRepository = mockDeep<IUserRepository>();
    jwtService = mockDeep<JwtService>();

    useCase = new LoginAuthUseCase(userRepository, jwtService);
    mockReset(userRepository);
    mockReset(jwtService);
  });

  describe('execute', () => {
    it('deve fazer login com sucesso usando email', async () => {
      const loginData = {
        identifier: 'test@example.com',
        password: 'correctPassword',
      };

      userRepository.findUserByIdentifier.mockResolvedValue(mockUser);
      vi.spyOn(hashHelper, 'compareHash').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await useCase.execute(loginData);

      expect(result).toEqual({
        user: {
          username: mockUser.username,
          email: mockUser.email,
          fullname: mockUser.fullname,
        },
        access_token: 'mock-token',
        expires_in: 3600,
      });

      expect(userRepository.findUserByIdentifier).toHaveBeenCalledWith(
        loginData.identifier,
      );
      expect(hashHelper.compareHash).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('deve fazer login com sucesso usando username', async () => {
      const loginData = {
        identifier: 'testuser',
        password: 'correctPassword',
      };

      userRepository.findUserByIdentifier.mockResolvedValue(mockUser);
      vi.spyOn(hashHelper, 'compareHash').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await useCase.execute(loginData);

      expect(result).toEqual({
        user: {
          username: mockUser.username,
          email: mockUser.email,
          fullname: mockUser.fullname,
        },
        access_token: 'mock-token',
        expires_in: 3600,
      });
    });

    it('deve lançar exceção quando usuário não for encontrado', async () => {
      const loginData = {
        identifier: 'nonexistent@example.com',
        password: 'anypassword',
      };

      userRepository.findUserByIdentifier.mockResolvedValue(null);

      await expect(useCase.execute(loginData)).rejects.toThrow(
        new Exception('AUTH_INVALID_CREDENTIALS'),
      );
    });

    it('deve lançar exceção quando usuário estiver inativo', async () => {
      const loginData = {
        identifier: 'test@example.com',
        password: 'correctPassword',
      };

      const inactiveUser = { ...mockUser, status: Status.INACTIVE };
      userRepository.findUserByIdentifier.mockResolvedValue(inactiveUser);

      await expect(useCase.execute(loginData)).rejects.toThrow(
        new Exception('USER_INACTIVE', { status: Status.INACTIVE }),
      );
    });

    it('deve lançar exceção quando a senha estiver incorreta', async () => {
      const loginData = {
        identifier: 'test@example.com',
        password: 'wrongPassword',
      };

      userRepository.findUserByIdentifier.mockResolvedValue(mockUser);
      vi.spyOn(hashHelper, 'compareHash').mockResolvedValue(false);

      await expect(useCase.execute(loginData)).rejects.toThrow(
        new Exception('AUTH_INVALID_CREDENTIALS'),
      );
    });

    it('deve lançar exceção quando ocorrer erro na comparação de senha', async () => {
      const loginData = {
        identifier: 'test@example.com',
        password: 'anyPassword',
      };

      userRepository.findUserByIdentifier.mockResolvedValue(mockUser);
      vi.spyOn(hashHelper, 'compareHash').mockRejectedValue(new Error());

      await expect(useCase.execute(loginData)).rejects.toThrow(
        new Exception('AUTH_INVALID_CREDENTIALS'),
      );
    });
  });
});
