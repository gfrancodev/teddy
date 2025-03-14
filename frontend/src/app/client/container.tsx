import { useState, useEffect, useCallback, useMemo } from 'react';
import { useClient } from '@/features/client/client.context';

export const useClientContainer = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  
  const { 
    clients, 
    selectClient, 
    isLoading,
    pagination,
    refetchClients
  } = useClient();

  // Efeito para monitorar mudanças e forçar refetch
  useEffect(() => {
    if (shouldRefetch) {
      refetchClients();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, refetchClients]);

  const handleCreateModalChange = useCallback((open: boolean) => {
    setCreateModalOpen(open);
  }, []);

  const handleEditModalChange = useCallback((open: boolean) => {
    setEditModalOpen(open);
  }, []);

  const handleDeleteModalChange = useCallback((open: boolean) => {
    setDeleteModalOpen(open);
  }, []);

  const openEditModal = useCallback((client: Client.Client) => {
    selectClient(client);
    setEditModalOpen(true);
  }, [selectClient]);

  const openDeleteModal = useCallback((client: Client.Client) => {
    selectClient(client);
    setDeleteModalOpen(true);
  }, [selectClient]);

  const openCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const values = useMemo(() => ({
    totalItems: clients?.total_items || 0,
    clientsList: clients?.data || [],
    currentPageValue: clients?.current_page || 1,
    totalPages: clients?.total_pages || 1,
    hasClients: (clients?.data?.length || 0) > 0,
  }), [clients]);

  return {
    states: {
      createModalOpen,
      editModalOpen,
      deleteModalOpen,
      isLoading,
      itemsPerPage: pagination.itemsPerPage,
    },
    
    handlers: {
      setCurrentPage: pagination.goToPage,
      setCreateModalOpen: handleCreateModalChange,
      setEditModalOpen: handleEditModalChange,
      setDeleteModalOpen: handleDeleteModalChange,
      handleItemsPerPageChange: (value: string) => 
        pagination.setItemsPerPage(Number(value)),
      handleSearchChange: pagination.setSearchTerm,
    },
    
    actions: {
      openEditModal,
      openDeleteModal,
      openCreateModal,
    },
    
    values
  };
};
