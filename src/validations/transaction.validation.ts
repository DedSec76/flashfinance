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
    type: z
      .enum(["income", "expense"], "Type must be income or expense.")
      .optional(),
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Choose a category from the list.")
      .optional(),
    startDate: z.coerce.date("Enter a valid start date.").optional(),
    endDate: z.coerce.date("Enter a valid end date.").optional(),
    month: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Enter a month like 2026-09.")
      .optional(),
    minAmount: z.coerce
      .number("Minimum amount must be a number.")
      .positive("Minimum amount must be greater than 0.")
      .refine(
        (value) => Number.isInteger(value * 100),
        "Minimum amount can have at most two decimal places.",
      )
      .optional(),
    maxAmount: z.coerce
      .number("Maximum amount must be a number.")
      .positive("Maximum amount must be greater than 0.")
      .refine(
        (value) => Number.isInteger(value * 100),
        "Maximum amount can have at most two decimal places.",
      )
      .optional(),
    page: z.coerce
      .number("Page must be a whole number.")
      .int("Page must be a whole number.")
      .min(1, "Page must be 1 or greater.")
      .default(1),
    limit: z.coerce
      .number("Results per page must be a whole number.")
      .int("Results per page must be a whole number.")
      .min(1, "Show at least 1 transaction per page.")
      .max(100, "Show at most 100 transactions per page.")
      .default(10),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }

      return true;
    },
    {
      message: "Start date must be on or before the end date.",
      path: ["endDate"],
    },
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
      message:
        "Minimum amount must be less than or equal to the maximum amount.",
      path: ["maxAmount"],
    },
  );

// Extrae el tipo de TypeScript automáticamente a partir del schema de Zod
export type TransactionInput = z.infer<typeof transactionSchema>;
