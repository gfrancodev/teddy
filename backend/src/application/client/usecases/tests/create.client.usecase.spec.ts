import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateClientUseCase } from '../create.client.usecase';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { IClientRepository } from '@/domain/interfaces/iclient.repository';
import { IBaseRepository, ClientEntity } from '@/domain';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { ClientFactory } from '@/domain/factories/client.factory';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let clientRepository: DeepMockProxy<IClientRepository>;
  let clientBaseRepository: DeepMockProxy<IBaseRepository<ClientEntity>>;

  const mockCreateData = {
    user_id: '1',
    name: 'Test Client',
    salary: 5000,
    company_value: 1000000,
  };

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
    clientRepository = mockDeep<IClientRepository>();
    clientBaseRepository = mockDeep<IBaseRepository<ClientEntity>>();
    useCase = new CreateClientUseCase(clientRepository, clientBaseRepository);
    mockReset(clientRepository);
    mockReset(clientBaseRepository);

    vi.spyOn(ClientFactory, 'create').mockReturnValue(mockClient);
  });

  describe('execute', () => {
    it('deve criar um cliente com sucesso', async () => {
      clientBaseRepository.create.mockResolvedValue(mockClient);

      const result = await useCase.execute(mockCreateData);

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

      expect(ClientFactory.create).toHaveBeenCalledWith(mockCreateData);
      expect(clientBaseRepository.create).toHaveBeenCalledWith(mockClient);
    });

    it('deve lançar exceção quando falhar ao criar cliente', async () => {
      clientBaseRepository.create.mockRejectedValue(new Error());

      await expect(useCase.execute(mockCreateData)).rejects.toThrow(
        new Exception('CLIENT_INVALID_INPUT'),
      );
    });
  });
});
