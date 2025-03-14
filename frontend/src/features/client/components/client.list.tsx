import { ClientCard } from "./client.card";
import { Skeleton } from '@/core/components/skeleton'
import { If } from '@/core/components/conditional/if';
import { For } from '@/core/components/conditional/for';

interface ClientsListProps {
  clients: Client.Client[];
  isLoading?: boolean;
  onEditClient?: (client: Client.Client) => void;
  onDeleteClient: (client: Client.Client) => void;
  showEditButton?: boolean;
  showAddButton?: boolean;
}

export const ClientsList = ({
  clients,
  isLoading = false,
  onEditClient,
  onDeleteClient,
}: ClientsListProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-y-[16px] xs:gap-y-[20px] 
        gap-x-[12px] xs:gap-x-[20px]">
        
        <If condition={isLoading}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-[200px] xs:h-[250px] w-full rounded-md" />
          ))}
        </If>
        
        <If condition={!isLoading}>
          <For 
            each={clients}
            empty={
              <div className="col-span-full text-center py-10 text-gray-500">
                Nenhum cliente encontrado.
              </div>
            }
          >
            {(client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={onEditClient}
                onDelete={onDeleteClient}
              />
            )}
          </For>
        </If>
      </div>
    </div>
  );
};
