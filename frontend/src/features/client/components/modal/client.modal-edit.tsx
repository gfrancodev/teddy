import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/core/components/dialog';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { formSchema, type ClientFormData } from '../../client.schema';
import { useClient } from '../../client.context';
import { formatDecimal, formatInputMoney } from '@/core/utils/format-money';

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditClientModal = ({
  open,
  onOpenChange,
}: EditClientModalProps) => {
  const { selectedClient, updateClient } = useClient();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedClient?.name || '',
      salary: selectedClient ? formatDecimal(selectedClient.salary) : '0,00',
      company_value: selectedClient
        ? formatDecimal(selectedClient.company_value)
        : '0,00',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!selectedClient) return;

    reset({
      name: selectedClient.name,
      salary: formatDecimal(selectedClient.salary),
      company_value: formatDecimal(selectedClient.company_value),
    });
  }, [selectedClient, reset]);

  const handleMoneyInput =
    (field: 'salary' | 'company_value') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatInputMoney(e.target.value);
      setValue(field, formatted, { shouldValidate: true });
    };

  const onSubmit = handleSubmit((data) => {
    if (!selectedClient) return;

    try {
      const formattedData = {
        name: data.name.trim(),
        salary: data.salary.replace(/\./g, '').replace(',', '.'),
        company_value: data.company_value.replace(/\./g, '').replace(',', '.'),
      };

      updateClient(selectedClient.id, {
        ...formattedData,
        salary: Number(formattedData.salary),
        company_value: Number(formattedData.company_value),
      });

      onOpenChange(false);
    } catch {
      // O erro será tratado pelo contexto
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none p-0 overflow-hidden">
        <DialogHeader className="relative p-4 pb-2">
          <DialogTitle className="text-2xl font-bold">
            Editar cliente:
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              placeholder="Nome do cliente"
              {...register('name')}
              error={errors.name?.message}
              className="rounded-none"
            />

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900">
                R$
              </span>
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900">
                R$
              </span>
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
              {isSubmitting ? 'Atualizando...' : 'Atualizar cliente'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
