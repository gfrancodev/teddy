import React from "react";
import { Button } from "@/core/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/select";
import { useIsMobile } from "@/core/hooks/use-mobile";
import { ClientsList } from "@/features/client/components/client.list";
import { ClientsPagination } from "@/features/client/components/client.pagination";
import { CreateClientModal } from "@/features/client/components/modal/client.modal-create";
import { EditClientModal } from "@/features/client/components/modal/client.modal-edit";
import { DeleteClientModal } from "@/features/client/components/modal/client.modal-delete";
import { useClientContainer } from "./container";
import { cn } from "@/core/utils/cn";

export const Clients = () => {
  const isMobile = useIsMobile();
  const { states, handlers, actions, values } = useClientContainer();

  const PaginationControls = ({ showPagination = true, showHeader = true }: { 
    showPagination?: boolean;
    showHeader?: boolean;
  }) => (
    <div className="flex flex-col gap-2 mt-4">
      {showHeader && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-teddy-darkgray font-bold text-base">
              {values.totalItems}
            </span>
            <span className="text-base">clientes encontrados</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Por página:</span>
            <Select
              value={states.itemsPerPage.toString()}
              onValueChange={handlers.handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[70px] h-[32px] border border-gray-200 bg-white">
                <SelectValue placeholder="16" />
              </SelectTrigger>
              <SelectContent align="center">
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="32">32</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="64">64</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {showPagination && (
        <div className="flex justify-center">
          <ClientsPagination
            currentPage={values.currentPageValue}
            setCurrentPage={handlers.setCurrentPage}
            totalPages={values.totalPages}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-teddy-gray min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[120px] py-8">
        <PaginationControls showPagination={isMobile} showHeader={true} />

        <div className="my-6">
          <ClientsList
            clients={values.clientsList}
            isLoading={states.isLoading}
            onEditClient={actions.openEditModal}
            onDeleteClient={actions.openDeleteModal}
          />
        </div>

          <Button
            variant="outline"
            onClick={actions.openCreateModal}
            className="w-full max-w-[1440px] mx-auto h-[40px] border-2 border-teddy-orange text-teddy-orange hover:bg-transparent hover:text-teddy-orange-light hover:border-teddy-orange-light rounded-[4px] font-bold text-sm"
          >
            Criar cliente
          </Button>

        <PaginationControls showPagination={true} showHeader={isMobile} />

        <CreateClientModal
          open={states.createModalOpen}
          onOpenChange={handlers.setCreateModalOpen}
        />
        <EditClientModal
          open={states.editModalOpen}
          onOpenChange={handlers.setEditModalOpen}
        />
        <DeleteClientModal
          open={states.deleteModalOpen}
          onOpenChange={handlers.setDeleteModalOpen}
        />
      </div>
    </div>
  );
};

export default Clients;
