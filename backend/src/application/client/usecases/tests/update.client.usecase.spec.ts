import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateClientUseCase } from '../update.client.usecase';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { IBaseRepository, ClientEntity } from '@/domain';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { ClientFactory } from '@/domain/factories/client.factory';

describe('UpdateClientUseCase', () => {
  let useCase: UpdateClientUseCase;
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

  const updateData = {
    name: 'Updated Client',
    salary: 6000,
    company_value: 1200000,
  };

  beforeEach(() => {
    clientBaseRepository = mockDeep<IBaseRepository<ClientEntity>>();
    useCase = new UpdateClientUseCase(clientBaseRepository);
    mockReset(clientBaseRepository);

    vi.spyOn(ClientFactory, 'update').mockReturnValue({
      id: mockClient.id,
      data: { ...mockClient, ...updateData },
    });
  });

  describe('execute', () => {
    it('deve atualizar um cliente com sucesso', async () => {
      clientBaseRepository.findById.mockResolvedValue(mockClient);
      clientBaseRepository.update.mockResolvedValue(undefined);

      await expect(
        useCase.execute(mockClient.id, updateData),
      ).resolves.not.toThrow();

      expect(clientBaseRepository.findById).toHaveBeenCalledWith(mockClient.id);
      expect(ClientFactory.update).toHaveBeenCalledWith(mockClient, updateData);
      expect(clientBaseRepository.update).toHaveBeenCalled();
    });

    it('deve lançar exceção quando cliente não for encontrado', async () => {
      clientBaseRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(999, updateData)).rejects.toThrow(
        new Exception('CLIENT_NOT_FOUND'),
      );
    });

    it('deve lançar exceção quando falhar ao atualizar cliente', async () => {
      clientBaseRepository.findById.mockResolvedValue(mockClient);
      clientBaseRepository.update.mockRejectedValue(new Error());

      await expect(useCase.execute(mockClient.id, updateData)).rejects.toThrow(
        new Exception('CLIENT_INVALID_INPUT'),
      );
    });
  });
});
