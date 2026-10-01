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

export const updateTransactionSchema = transactionSchema.partial();

export const transactionFiltersSchema = z
  .object({
    type: z.enum(["income", "expense"]).optional(),
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category id")
      .optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    month: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must follow YYYY-MM")
      .optional(),
    minAmount: z.coerce
      .number()
      .positive("Minimum amount must be greater than 0")
      .refine(
        (value) => Number.isInteger(value * 100),
        "Minimum amount cannot have more than two decimal places."
      )
      .optional(),
    maxAmount: z.coerce
      .number()
      .positive("Maximum amount must be greater than 0")
      .refine(
        (value) => Number.isInteger(value * 100),
        "Maximum amount cannot have more than two decimal places."
      )
      .optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }

      return true;
    },
    {
      message: "startDate must be before or equal to endDate.",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (
        typeof data.minAmount === "number" &&
        typeof data.maxAmount === "number"
      ) {
        return data.minAmount <= data.maxAmount;
      }

      return true;
    },
    {
      message: "minAmount must be less than or equal to maxAmount.",
      path: ["maxAmount"],
    }
  );

// Extrae el tipo de TypeScript automáticamente a partir del schema de Zod
export type TransactionInput = z.infer<typeof transactionSchema>;
