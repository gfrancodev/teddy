import { beforeEach, describe, expect, it } from 'vitest';
import { MeAuthUseCase } from '../me.auth.usecase';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { IBaseRepository, UserEntity } from '@/domain';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { Status } from '@/domain/enum/status.enum';
import { Roles } from '@/domain/enum/role.enum';

describe('MeAuthUseCase', () => {
  let useCase: MeAuthUseCase;
  let userBaseRepository: DeepMockProxy<IBaseRepository<UserEntity>>;

  const mockUser: UserEntity = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Roles.USER,
    status: Status.ACTIVE,
    created_at: new Date('2024-01-01T00:00:00.000Z').getTime(),
    updated_at: new Date('2024-01-01T00:00:00.000Z').getTime(),
    fullname: 'Test User',
    last_access: 1704067200000,
    verified: true,
    deleted_at: null,
  };

  beforeEach(() => {
    userBaseRepository = mockDeep<IBaseRepository<UserEntity>>();
    useCase = new MeAuthUseCase(userBaseRepository);
    mockReset(userBaseRepository);
  });

  describe('execute', () => {
    it('deve retornar os dados do usuário com sucesso', async () => {
      userBaseRepository.findById.mockResolvedValue(mockUser);

      const result = await useCase.execute(mockUser.id);

      // Usando toMatchObject para ignorar o formato exato das datas
      expect(result).toMatchObject({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        fullname: mockUser.fullname,
        role: mockUser.role,
        status: mockUser.status,
        verified: mockUser.verified,
        deleted_at: mockUser.deleted_at,
        last_access: mockUser.last_access,
      });

      // Verificando se as datas estão presentes e são strings válidas
      expect(result.created_at).toBeDefined();
      expect(typeof result.created_at).toBe('string');
      expect(result.updated_at).toBeDefined();
      expect(typeof result.updated_at).toBe('string');

      expect(userBaseRepository.findById).toHaveBeenCalledWith(mockUser.id);
    });

    it('deve lançar exceção quando usuário não for encontrado', async () => {
      const userId = 'non-existent-id';
      userBaseRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(userId)).rejects.toThrow(
        new Exception('USER_NOT_FOUND'),
      );

      expect(userBaseRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
