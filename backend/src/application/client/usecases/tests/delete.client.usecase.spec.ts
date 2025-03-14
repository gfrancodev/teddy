import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteClientUseCase } from '../delete.client.usecase';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { IBaseRepository, ClientEntity } from '@/domain';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { ClientFactory } from '@/domain/factories/client.factory';

describe('DeleteClientUseCase', () => {
  let useCase: DeleteClientUseCase;
  let clientBaseRepository: DeepMockProxy<IBaseRepository<ClientEntity>>;

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
    clientBaseRepository = mockDeep<IBaseRepository<ClientEntity>>();
    useCase = new DeleteClientUseCase(clientBaseRepository);
    mockReset(clientBaseRepository);

    vi.spyOn(ClientFactory, 'delete').mockReturnValue({
      id: mockClient.id,
      data: { ...mockClient, deleted_at: Date.now() },
    });
  });

  describe('execute', () => {
    it('deve deletar um cliente com sucesso', async () => {
      clientBaseRepository.findById.mockResolvedValue(mockClient);
      clientBaseRepository.update.mockResolvedValue(undefined);

      await expect(useCase.execute(mockClient.id)).resolves.not.toThrow();

      expect(clientBaseRepository.findById).toHaveBeenCalledWith(mockClient.id);
      expect(ClientFactory.delete).toHaveBeenCalledWith(mockClient);
      expect(clientBaseRepository.update).toHaveBeenCalled();
    });

    it('deve lançar exceção quando cliente não for encontrado', async () => {
      clientBaseRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(999)).rejects.toThrow(
        new Exception('CLIENT_NOT_FOUND'),
      );
    });

    it('deve lançar exceção quando falhar ao deletar cliente', async () => {
      clientBaseRepository.findById.mockResolvedValue(mockClient);
      clientBaseRepository.update.mockRejectedValue(new Error());

      await expect(useCase.execute(mockClient.id)).rejects.toThrow(
        new Exception('INTERNAL_DATABASE_ERROR'),
      );
    });
  });
});
