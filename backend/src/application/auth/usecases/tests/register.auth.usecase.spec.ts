import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterAuthUseCase } from '../register.auth.usecase';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { IUserRepository } from '@/domain/interfaces/iuser.repository';
import { IBaseRepository, UserEntity } from '@/domain';
import { Exception } from '@/infrastructure/exception/builder/exception';
import * as hashHelper from '@/infrastructure/helpers/hash.helper';
import { UserFactory } from '@/domain/factories/user.factory';

describe('RegisterAuthUseCase', () => {
  let useCase: RegisterAuthUseCase;
  let userRepository: DeepMockProxy<IUserRepository>;
  let userBaseRepository: DeepMockProxy<IBaseRepository<UserEntity>>;

  const mockRegisterData = {
    fullname: 'Test User',
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
  };

  const mockHashedPassword = 'hashedPassword123';

  beforeEach(() => {
    userRepository = mockDeep<IUserRepository>();
    userBaseRepository = mockDeep<IBaseRepository<UserEntity>>();

    useCase = new RegisterAuthUseCase(userRepository, userBaseRepository);
    mockReset(userRepository);
    mockReset(userBaseRepository);

    vi.spyOn(hashHelper, 'generateHash').mockResolvedValue(mockHashedPassword);
    vi.spyOn(UserFactory, 'create').mockReturnValue({} as UserEntity);
  });

  describe('execute', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      userRepository.findUserByIdentifier.mockResolvedValue(null);
      userBaseRepository.create.mockResolvedValue(undefined);

      await expect(useCase.execute(mockRegisterData)).resolves.not.toThrow();

      expect(userRepository.findUserByIdentifier).toHaveBeenCalledWith(
        mockRegisterData.email,
      );
      expect(userRepository.findUserByIdentifier).toHaveBeenCalledWith(
        mockRegisterData.username,
      );
      expect(hashHelper.generateHash).toHaveBeenCalledWith(
        mockRegisterData.password,
      );
      expect(UserFactory.create).toHaveBeenCalledWith({
        fullname: mockRegisterData.fullname,
        email: mockRegisterData.email,
        username: mockRegisterData.username,
        password: mockHashedPassword,
      });
      expect(userBaseRepository.create).toHaveBeenCalled();
    });

    it('deve lançar exceção quando email já existe', async () => {
      userRepository.findUserByIdentifier
        .mockResolvedValueOnce({} as UserEntity) // email existe
        .mockResolvedValueOnce(null); // username não existe

      await expect(useCase.execute(mockRegisterData)).rejects.toThrow(
        new Exception('USER_EMAIL_ALREADY_EXISTS'),
      );

      expect(userBaseRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando username já existe', async () => {
      userRepository.findUserByIdentifier
        .mockResolvedValueOnce(null) // email não existe
        .mockResolvedValueOnce({} as UserEntity); // username existe

      await expect(useCase.execute(mockRegisterData)).rejects.toThrow(
        new Exception('USER_USERNAME_ALREADY_EXISTS', {
          username: mockRegisterData.username,
        }),
      );

      expect(userBaseRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando falha ao gerar hash da senha', async () => {
      userRepository.findUserByIdentifier.mockResolvedValue(null);
      vi.spyOn(hashHelper, 'generateHash').mockRejectedValue(new Error());

      await expect(useCase.execute(mockRegisterData)).rejects.toThrow(
        new Exception('AUTH_PASSWORD_HASH_FAILED'),
      );

      expect(userBaseRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando falha ao criar usuário', async () => {
      userRepository.findUserByIdentifier.mockResolvedValue(null);
      userBaseRepository.create.mockRejectedValue(new Error());

      await expect(useCase.execute(mockRegisterData)).rejects.toThrow(
        new Exception('AUTH_REGISTRATION_FAILED'),
      );
    });
  });
});
