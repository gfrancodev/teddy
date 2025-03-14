declare namespace Client {
  interface ContextType {
    clients: Client.ClientsResponse | null;
    selectedClient: Client.Client | null;
    isLoading: boolean;
    error: Error | null;
    createClient: (data: Client.CreateClientDTO) => void;
    updateClient: (id: number, data: Client.UpdateClientDTO) => void;
    deleteClient: (id: number) => void;
    selectClient: (client: Client.Client | null) => void;
    getClientDetails: (id: number) => Promise<ClientDetails>;
    refetchClients: () => Promise<QueryObserverResult<ClientsResponse, Error>>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      goToPage: (page: number) => void;
      setItemsPerPage: (limit: number) => void;
      setSearchTerm: (term: string) => void;
    };
    selectedClients: Client.Client[];
    addSelectedClient: (client: Client.Client) => void;
    removeSelectedClient: (clientId: number) => void;
    clearSelectedClients: () => void;
    isClientSelected: (clientId: number) => boolean;
  }

  interface Client {
    id: number;
    user_id: string;
    name: string;
    salary: number;
    company_value: number;
    status: 'active' | 'inactive';
    created_at: number;
    updated_at: number | null;
    deleted_at: number | null;
  }

  interface CreateClientDTO {
    name: string;
    salary: number | string;
    company_value: number | string;
  }

  interface UpdateClientDTO {
    name?: string;
    salary?: number | string;
    company_value?: number | string;
  }

  interface ClientsResponse {
    current_page: number;
    total_pages: number;
    total_items: number;
    limit: number;
    in_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    data: Client[];
  }

  interface ClientsParams {
    current_page?: number;
    limit?: number;
    filter?: string;
  }

  interface ClientDetails extends Client {
    additional_info?: {
      total_contracts?: number;
      total_revenue?: number;
      last_contract_date?: string;
      risk_assessment?: 'low' | 'medium' | 'high';
    };
    contacts?: {
      phone?: string;
      email?: string;
      address?: string;
    };
    financial_history?: {
      annual_revenue?: number;
      profit_margin?: number;
      credit_score?: number;
    };
  }
}

export = Client;
export as namespace Client;
