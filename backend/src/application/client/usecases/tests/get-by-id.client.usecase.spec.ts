import { beforeEach, describe, expect, it } from 'vitest';
import { GetByIdClientUseCase } from '../get-by-id.client.usecase';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { IBaseRepository, ClientEntity } from '@/domain';
import { Exception } from '@/infrastructure/exception/builder/exception';

describe('GetByIdClientUseCase', () => {
  let useCase: GetByIdClientUseCase;
  let clientRepository: DeepMockProxy<IBaseRepository<ClientEntity>>;

  const mockClient: ClientEntity = {
    id: 1,
    user_id: '1',
    name: 'Test Client',
    salary: 5000,
    company_value: 1000000,
    created_at: new Date('2024-01-01T00:00:00.000Z').getTime(),
    updated_at: new Date('2024-01-01T00:00:00.000Z').getTime(),
    deleted_at: null,
  };

  beforeEach(() => {
    clientRepository = mockDeep<IBaseRepository<ClientEntity>>();
    useCase = new GetByIdClientUseCase(clientRepository);
    mockReset(clientRepository);
  });

  describe('execute', () => {
    it('deve retornar um cliente por ID com sucesso', async () => {
      clientRepository.findById.mockResolvedValue(mockClient);

      const result = await useCase.execute(String(mockClient.id));

      expect(result).toMatchObject({
        id: mockClient.id,
        user_id: mockClient.user_id,
        name: mockClient.name,
        salary: mockClient.salary,
        company_value: mockClient.company_value,
        deleted_at: null,
      });

      expect(result.created_at).toBeDefined();
      expect(typeof result.created_at).toBe('string');
      expect(result.updated_at).toBeDefined();
      expect(typeof result.updated_at).toBe('string');

      expect(clientRepository.findById).toHaveBeenCalledWith(
        String(mockClient.id),
      );
    });

    it('deve lançar exceção quando cliente não for encontrado', async () => {
      clientRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('999')).rejects.toThrow(
        new Exception('CLIENT_NOT_FOUND'),
      );
    });
  });
});
