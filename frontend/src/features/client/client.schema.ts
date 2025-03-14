import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  salary: z.string().min(1, 'Salário é obrigatório'),
  company_value: z.string().min(1, 'Valor da empresa é obrigatório')
});

export const clientSchema = formSchema;

export type ClientFormData = z.infer<typeof formSchema>;

export type ClientSchemaType = {
  name: string;
  salary: number;
  company_value: number;
};

// Tipos para API
export type CreateClientDTO = ClientFormData;
export type UpdateClientDTO = ClientFormData;
