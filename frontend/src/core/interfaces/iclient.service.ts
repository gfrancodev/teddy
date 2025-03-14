export interface IClientService {
  getById(id: number): Promise<Client.Client>;
  createClient(data: Client.CreateClientDTO): Promise<Client.Client>;
  updateClient(
    id: number,
    data: Client.UpdateClientDTO
  ): Promise<Client.Client>;
  deleteClient(id: number): Promise<void>;
  searchClients(
    searchTerm: string,
    page?: number,
    limit?: number
  ): Promise<Client.ClientsResponse>;
  getClientDetails(id: number): Promise<Client.ClientDetails>;
}
