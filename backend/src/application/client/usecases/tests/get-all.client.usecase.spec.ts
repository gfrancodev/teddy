import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllClientUseCase } from '../get-all.client.usecase';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { IClientRepository } from '@/domain/interfaces/iclient.repository';
import { Exception } from '@/infrastructure/exception/builder/exception';
import { Roles } from '@/domain';

describe('GetAllClientUseCase', () => {
  let useCase: GetAllClientUseCase;
  let clientRepository: DeepMockProxy<IClientRepository>;

  const mockPaginatedResult = {
    data: [
      {
        id: 1,
        user_id: '1',
        name: 'Test Client',
        salary: 5000,
        company_value: 1000000,
        created_at: new Date('2024-01-01T00:00:00.000Z').getTime(),
        updated_at: new Date('2024-01-01T00:00:00.000Z').getTime(),
        deleted_at: null,
        status: true,
      },
    ],
    current_page: 1,
    total_pages: 1,
    total_items: 1,
    limit: 16,
    in_page: 1,
    has_next_page: false,
    has_previous_page: false,
  };

  beforeEach(() => {
    clientRepository = mockDeep<IClientRepository>();
    useCase = new GetAllClientUseCase(clientRepository);
    mockReset(clientRepository);
  });

  describe('mountFilter', () => {
    it('deve retornar filtros com user_id quando role for USER', () => {
      const data = {
        user_id: '1',
        filter: 'test',
        current_page: 2,
        limit: 20,
      };

      const result = useCase.mountFilter(data, Roles.USER);

      expect(result).toEqual({
        user_id: '1',
        filter: 'test',
        current_page: 2,
        limit: 20,
      });
    });

    it('deve retornar filtros com user_id null quando role for ADMIN', () => {
      const data = {
        user_id: '1',
        filter: 'test',
        current_page: 2,
        limit: 20,
      };

      const result = useCase.mountFilter(data, Roles.ADMIN);

      expect(result).toEqual({
        user_id: null,
        filter: 'test',
        current_page: 2,
        limit: 20,
      });
    });

    it('deve retornar valores default quando não informados', () => {
      const data = {
        user_id: '1',
        filter: '',
      } as any;

      const result = useCase.mountFilter(data, Roles.USER);

      expect(result).toEqual({
        user_id: '1',
        filter: '',
        current_page: 1,
        limit: 16,
      });
    });
  });

  describe('execute', () => {
    it('deve retornar lista paginada de clientes para usuário normal', async () => {
      const filters = {
        user_id: '1',
        filter: '',
        current_page: 1,
        limit: 16,
      } as any;

      clientRepository.findAll.mockResolvedValue(mockPaginatedResult as any);

      const result = await useCase.execute(filters, Roles.USER);

      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
        current_page: expect.any(Number),
        total_pages: expect.any(Number),
        total_items: expect.any(Number),
        limit: expect.any(Number),
        in_page: expect.any(Number),
        has_next_page: expect.any(Boolean),
        has_previous_page: expect.any(Boolean),
      });

      expect(clientRepository.findAll).toHaveBeenCalledWith({
        ...filters,
        user_id: '1',
      });
    });

    it('deve retornar lista paginada de clientes para admin sem filtro de usuário', async () => {
      const filters = {
        user_id: '1',
        filter: '',
        current_page: 1,
        limit: 16,
      } as any;

      clientRepository.findAll.mockResolvedValue(mockPaginatedResult as any);

      const result = await useCase.execute(filters, Roles.ADMIN);

      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
        current_page: expect.any(Number),
        total_pages: expect.any(Number),
        total_items: expect.any(Number),
        limit: expect.any(Number),
        in_page: expect.any(Number),
        has_next_page: expect.any(Boolean),
        has_previous_page: expect.any(Boolean),
      });

      expect(clientRepository.findAll).toHaveBeenCalledWith({
        ...filters,
        user_id: null,
      });
    });

    it('deve lançar exceção quando ocorrer erro na busca', async () => {
      const filters = {
        user_id: '1',
        filter: '',
        current_page: 1,
        limit: 16,
      };

      clientRepository.findAll.mockRejectedValue(new Error());

      await expect(useCase.execute(filters, Roles.USER)).rejects.toThrow(
        new Exception('INTERNAL_DATABASE_ERROR'),
      );
    });
  });
});
