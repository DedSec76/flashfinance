import { z } from 'zod';

export const transactionSchema = z.object({
  title: z
    .string('The title is required')
    .min(1, 'The title cannot be empty'),
    
  amount: z.coerce
    .number('Amount is required')
    .positive('Amount must be greater than 0')
    .refine(
      (value) => Number.isInteger(value * 100),
      "The amount cannot have more than two decimal places."
    ),
    
  type: z
    .enum(['income', 'expense'], 'Type must be income or expense'),
    
  categoryId: z
    .string('The category id is required' )
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID"), 
    
  description: z
    .string()
    .max(1000, 'The description cannot exceed 1,000 characters.')
    .nullable(),
    
  date: z
    .coerce // Convierte automáticamente strings de fecha (ej: '2026-09-27') a objetos Date de JS
    .date('The date must be a valid date.'),
});

// Extrae el tipo de TypeScript automáticamente a partir del schema de Zod
export type TransactionInput = z.infer<typeof transactionSchema>;
