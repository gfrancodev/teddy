import { Plus, Pencil, Trash, Minus } from 'lucide-react';
import { Client } from '../client';
import { useClient } from '../client.context';
import { Button } from '@/core/components/button';
import { useLocation } from 'react-router-dom';
import { Else } from '@/core/components/conditional/else';
import { formatMoney } from '@/core/utils/format-money';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientCard = ({ client, onEdit, onDelete }: ClientCardProps) => {
  const { addSelectedClient, removeSelectedClient, isClientSelected } =
    useClient();
  const selected = isClientSelected(client.id);
  const location = useLocation();
  const isSelectedPage = location.pathname === '/clients/selected';

  const handleToggleSelect = () => {
    if (selected) {
      removeSelectedClient(client.id);
    } else {
      addSelectedClient(client);
    }
  };

  const CardActions = () => (
    <Else
      condition={isSelectedPage}
      fallback={
        <div className="flex w-full">
          <Button
            variant="ghost"
            onClick={handleToggleSelect}
            className={'flex-1 h-[40px] rounded-none hover:bg-gray-50 transition-colors text-gray-900'}
          >
            {selected ? <Minus size={20} /> : <Plus size={20} />}
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(client)}
              className="flex-1 h-[40px] hover:bg-gray-50 text-gray-900 transition-colors"
            >
              <Pencil size={17} className="mx-auto" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(client)}
            className="flex-1 h-[40px] hover:bg-gray-50 text-red-500 transition-colors"
          >
            <Trash size={17} className="mx-auto" />
          </Button>
        </div>
      }
    >
      <div className="flex w-full border-t">
        <div className="flex-1" />
        <div className="flex-1" />
        <Button
          variant="ghost"
          className="flex-1 rounded-none text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => removeSelectedClient(client.id)}
        >
          <Minus size={17} className="mx-auto" />
        </Button>
      </div>
    </Else>
  );

  return (
    <div className="w-full max-w-[285px] min-h-[138px] bg-white rounded-[4px] border-0 shadow-[0px_0px_4px_rgba(0,0,0,0.1)] flex flex-col">
      <div className="flex-1 p-4">
        <h3 className="text-center font-bold text-base text-black mb-2.5">
          {client.name}
        </h3>
        <div className="text-sm space-y-2.5">
          <div className="text-black">
            <span className="font-normal">Salário: </span>
            <span>{formatMoney(client.salary)}</span>
          </div>
          <div className="text-black">
            <span className="font-normal">Empresa: </span>
            <span>{formatMoney(client.company_value)}</span>
          </div>
        </div>
      </div>

      <CardActions />
    </div>
  );
};
