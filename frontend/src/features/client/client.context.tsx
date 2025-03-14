import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ClientService } from './client.service';
import { HttpProvider } from '@/core/providers/http.provider';
import { JSONStorage } from '@brushy/localstorage';

const CLIENT_LIST_KEY = 'clients';
const httpProvider = new HttpProvider();
const clientService = new ClientService(httpProvider);

const SELECTED_CLIENTS_KEY = 'selected-clients';
const selectedClientsStorage = new JSONStorage(SELECTED_CLIENTS_KEY);

const ClientContext = createContext<Client.ContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedClient, setSelectedClient] = React.useState<Client.Client | null>(null);
  const [paginationParams, setPaginationParams] = React.useState({
    term: '',
    page: 1,
    limit: 16,
  });

  const queryClient = useQueryClient();

  const { 
    data: clients, 
    isLoading, 
    error 
  } = useQuery<Client.ClientsResponse, Error>({
    queryKey: [CLIENT_LIST_KEY, paginationParams],
    queryFn: () => clientService.searchClients(
      paginationParams.term,
      paginationParams.page,
      paginationParams.limit
    )
  });

  const createMutation = useMutation<Client.Client, Error, Client.CreateClientDTO>({
    mutationFn: (data) => clientService.createClient(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CLIENT_LIST_KEY] });
      toast.success('Cliente criado com sucesso!', { 
        dismissible: true,
        closeButton: true 
      });
    },
    onError: (error: Error) => {
      console.error('Create client failed:', error);
      toast.error(error.message, { 
        dismissible: true,
        closeButton: true 
      });
    }
  });

  const updateMutation = useMutation<Client.Client, Error, { id: number; data: Client.UpdateClientDTO }>({
    mutationFn: ({ id, data }) => clientService.updateClient(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CLIENT_LIST_KEY] });
      toast.success('Cliente atualizado com sucesso!', { 
        dismissible: true,
        closeButton: true 
      });
    },
    onError: (error: Error) => {
      console.error('Update client failed:', error);
      toast.error(error.message, { 
        dismissible: true,
        closeButton: true 
      });
    }
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => clientService.deleteClient(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CLIENT_LIST_KEY] });
      setSelectedClient(null);
      toast.success('Cliente excluído com sucesso!', { 
        dismissible: true,
        closeButton: true 
      });
    },
    onError: (error: Error) => {
      console.error('Delete client failed:', error);
      toast.error(error.message, { 
        dismissible: true,
        closeButton: true 
      });
    }
  });

  const paginationHandlers = {
    goToPage: (page: number) => setPaginationParams(prev => ({ ...prev, page })),
    setItemsPerPage: (limit: number) => setPaginationParams(prev => ({ ...prev, page: 1, limit })),
    setSearchTerm: (term: string) => setPaginationParams(prev => ({ ...prev, page: 1, term })),
  };

  const [selectedClients, setSelectedClients] = React.useState<Client.Client[]>(
    selectedClientsStorage.getJSON('data') || []
  );

  const addSelectedClient = (client: Client.Client) => {
    const updatedClients = [...selectedClients, client];
    setSelectedClients(updatedClients);
    selectedClientsStorage.setJSON('data', updatedClients);
    toast.success('Cliente adicionado aos selecionados!', { 
      dismissible: true,
      closeButton: true 
    });
  };

  const removeSelectedClient = (clientId: number) => {
    const updatedClients = selectedClients.filter(c => c.id !== clientId);
    setSelectedClients(updatedClients);
    selectedClientsStorage.setJSON('data', updatedClients);
    toast.success('Cliente removido dos selecionados!', { 
      dismissible: true,
      closeButton: true 
    });
  };

  const clearSelectedClients = () => {
    setSelectedClients([]);
    selectedClientsStorage.remove('data');
    toast.success('Lista de clientes selecionados foi limpa!', { 
      dismissible: true,
      closeButton: true 
    });
  };

  const isClientSelected = (clientId: number) => {
    return selectedClients.some(c => c.id === clientId);
  };

  const contextValue: Client.ContextType = {
    clients: clients || null,
    selectedClient,
    isLoading,
    error: error || null,
    createClient: createMutation.mutate,
    updateClient: (id, data) => updateMutation.mutate({ id, data }),
    deleteClient: deleteMutation.mutate,
    selectClient: setSelectedClient,
    getClientDetails: (id) => clientService.getClientDetails(id),
    refetchClients: () => queryClient.invalidateQueries({ queryKey: [CLIENT_LIST_KEY] }),
    pagination: {
      currentPage: clients?.current_page || 1,
      totalPages: clients?.total_pages || 1,
      totalItems: clients?.total_items || 0,
      itemsPerPage: paginationParams.limit,
      hasNextPage: clients?.has_next_page || false,
      hasPreviousPage: clients?.has_previous_page || false,
      ...paginationHandlers,
    },
    selectedClients,
    addSelectedClient,
    removeSelectedClient,
    clearSelectedClients,
    isClientSelected,
  };

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) throw new Error('useClient must be used within ClientProvider');
  return context;
};
