import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/core/components/dialog';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { clientSchema, type ClientFormData } from '../../client.schema';
import { useClient } from '../../client.context';
import { formatInputMoney } from '@/core/utils/format-money';

interface CreateClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateClientModal = ({ open, onOpenChange }: CreateClientModalProps) => {
  const { createClient } = useClient();

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      salary: '0',
      company_value: '0'
    }
  });

  const onSubmit = async (data: ClientFormData) => {
    console.time('client.create');
    try {
      await createClient(data as Client.CreateClientDTO);
      reset();
      onOpenChange(false);
      console.timeLog('client.create', data);
    } finally {
      console.timeEnd()
    }
  };

  const handleMoneyInput = (field: 'salary' | 'company_value') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputMoney(e.target.value);
    setValue(field, formatted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none p-0 overflow-hidden">
        <DialogHeader className="relative p-4 pb-2">
          <DialogTitle className="text-2xl font-bold">Criar cliente:</DialogTitle>
        </DialogHeader>
        
        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              placeholder="Nome do cliente" 
              {...register('name')}
              error={errors.name?.message}
              className="rounded-none"
            />
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900">R$</span>
              <Input 
                placeholder="0,00" 
                {...register('salary')}
                onChange={handleMoneyInput('salary')}
                value={watch('salary')}
                error={errors.salary?.message}
                className="rounded-none pl-9"
              />
            </div>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900">R$</span>
              <Input 
                placeholder="0,00" 
                {...register('company_value')}
                onChange={handleMoneyInput('company_value')}
                value={watch('company_value')}
                error={errors.company_value?.message}
                className="rounded-none pl-9"
              />
            </div>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teddy-orange hover:bg-teddy-orange/90 text-white rounded-none h-12 mt-4"
            >
              {isSubmitting ? 'Criando...' : 'Criar cliente'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
