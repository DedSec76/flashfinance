import { z } from "zod";

const categoryName = z
  .string("Category name is required.")
  .refine((value) => value.trim().length > 0, "Category name is required.")
  .refine(
    (value) => value.trim().length <= 80,
    "Category name must be 80 characters or fewer.",
  );

const categoryType = z.enum(
  ["income", "expense"],
  "Type must be income or expense.",
);

export const createCategorySchema = z.object({
  name: categoryName,
  type: categoryType,
});

export const updateCategorySchema = z
  .object({
    name: categoryName.optional(),
    type: categoryType.optional(),
  })
  .refine((value) => value.name !== undefined || value.type !== undefined, {
    message: "Provide a name or a type to update.",
  });

export const categoryIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid category.");

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
