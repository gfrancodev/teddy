import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Usuário ou email deve ter no mínimo 3 caracteres')
    .max(100, 'Usuário ou email deve ter no máximo 100 caracteres'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres')
    .trim(),
});

export type LoginFormValues = z.infer<typeof loginSchema>; 