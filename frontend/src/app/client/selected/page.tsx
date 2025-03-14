import { Button } from "@/core/components/button";
import { ClientsList } from "@/features/client/components/client.list";
import { useClient } from "@/features/client/client.context";

export const SelectedClients = () => {
  const { selectedClients, clearSelectedClients, removeSelectedClient } = useClient();

  return (
    <div className="w-full bg-teddy-gray min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[120px] py-8">
        <div className="relative mb-4">
          <h2 className="font-inter font-bold text-[22px] leading-[27px] text-black">
            Clientes selecionados:
          </h2>
        </div>

        <ClientsList
          clients={selectedClients}
          isLoading={false}
          onDeleteClient={(client) => removeSelectedClient(client.id)}
          showEditButton={false}
          showAddButton={false}
        />

        <div className="mt-5">
          <Button
            variant="outline"
            onClick={clearSelectedClients}
            className="w-full max-w-[1440px] mx-auto h-[40px] border-2 border-teddy-orange text-teddy-orange hover:bg-transparent hover:text-teddy-orange-light hover:border-teddy-orange-light rounded-[4px] font-bold text-sm"
          >
            Limpar clientes selecionados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedClients; 