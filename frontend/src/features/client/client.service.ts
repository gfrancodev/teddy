import { IClientService } from '@/core/interfaces/iclient.service';
import { IHttpProvider } from '@/core/interfaces/ihttp.provider';
import { parseMoney } from '@/core/utils/format-money';

export class ClientService implements IClientService {
  private readonly baseUrl = '/v1/client';

  constructor(private readonly httpProvider: IHttpProvider) {}

  /**
   * Retrieves a specific client by ID
   */
  async getById(id: number): Promise<Client.Client> {
    const response = await this.httpProvider.get<Client.Client>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  /**
   * Creates a new client
   */
  async createClient(data: Client.CreateClientDTO): Promise<Client.Client> {
    try {
      const response = await this.httpProvider.post<Client.Client>(
        this.baseUrl,
        {
          ...data,
          salary: typeof data.salary === 'string' ? parseMoney(data.salary) : data.salary,
          company_value: typeof data.company_value === 'string' ? parseMoney(data.company_value) : data.company_value
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Falha ao criar cliente');
    }
  }

  /**
   * Updates an existing client
   */
  async updateClient(
    id: number,
    data: Client.UpdateClientDTO
  ): Promise<Client.Client> {
    try {
      const response = await this.httpProvider.put<Client.Client>(
        `${this.baseUrl}/${id}`,
        {
          name: data.name,
          salary: Number(data.salary),
          company_value: Number(data.company_value)
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Falha ao atualizar cliente');
    }
  }

  /**
   * Deletes a client
   */
  async deleteClient(id: number): Promise<void> {
    try {
      await this.httpProvider.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error('Falha ao excluir cliente');
    }
  }

  /**
   * Searches for clients by search term
   */
  async searchClients(
    searchTerm: string,
    page: number = 1,
    limit: number = 16
  ): Promise<Client.ClientsResponse> {
    try {
      const response = await this.httpProvider.get<Client.ClientsResponse>(
        this.baseUrl,
        {
          current_page: page,
          limit,
          filter: searchTerm,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Falha ao buscar clientes');
    }
  }

  /**
   * Obtém detalhes completos de um cliente
   */
  async getClientDetails(id: number): Promise<Client.ClientDetails> {
    const response = await this.httpProvider.get<Client.ClientDetails>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }
}
