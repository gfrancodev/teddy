import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/core/components/dialog';
import { Button } from '@/core/components/button';
import { useClient } from '../../client.context';

interface DeleteClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteClientModal = ({ open, onOpenChange }: DeleteClientModalProps) => {
  const { selectedClient, deleteClient } = useClient();

  const handleDelete = async () => {
    if (!selectedClient) return;

    try {
      await deleteClient(selectedClient.id);
      onOpenChange(false);
    } catch {
      // O erro será tratado pelo contexto
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none p-0 overflow-hidden">
        <DialogHeader className="relative p-4">
          <DialogTitle className="text-2xl font-bold">Excluir cliente:</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <p className="text-lg">
            Você está prestes a excluir o cliente <span className="font-semibold">{selectedClient?.name}</span>
          </p>
          
          <Button 
            onClick={handleDelete}
            className="w-full bg-teddy-orange hover:bg-teddy-orange/90 text-white rounded-none h-12 mt-8"
          >
            Excluir cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
