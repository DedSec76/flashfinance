import { AppError } from "@/src/lib/errors/app-error";
import { countTransactionsForCategory } from "@/src/repositories/transaction.repository";
import {
  createCategory,
  deleteCategory,
  findCategoriesByUserId,
  findCategoryByIdAndUserId,
  findCategoryByNormalizedName,
  updateCategory,
} from "@/src/repositories/category.repository";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/src/validations/category.validation";
import { categoryIdSchema } from "@/src/validations/category.validation";

export type CategoryView = {
  id: string;
  name: string;
  type: "income" | "expense";
  transactionCount: number;
};

function normalizeCategoryName(name: string) {
  return name.trim().toLowerCase();
}

function assertCategoryId(id: string) {
  const result = categoryIdSchema.safeParse(id);

  if (!result.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid category.", 400);
  }
}

function categoryNotFound() {
  return new AppError("CATEGORY_NOT_FOUND", "Category not found.", 404);
}

function duplicateCategory() {
  return new AppError(
    "CATEGORY_DUPLICATE",
    "A category with this name already exists.",
    409,
  );
}

function isDuplicateKey(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

function toCategoryView(
  category: { _id: unknown; id?: string; name: string; type: "income" | "expense" },
  transactionCount: number,
): CategoryView {
  return {
    id: String(category.id ?? category._id),
    name: category.name,
    type: category.type,
    transactionCount,
  };
}

export async function listCategoriesService(userId: string): Promise<CategoryView[]> {
  const categories = await findCategoriesByUserId(userId);

  return Promise.all(
    categories.map(async (category) => {
      const transactionCount = await countTransactionsForCategory(
        String(category._id),
        userId,
      );

      return toCategoryView(category, transactionCount);
    }),
  );
}

export async function createCategoryService(userId: string, input: CreateCategoryInput) {
  const name = input.name.trim();

  if (!name) {
    throw new AppError("VALIDATION_ERROR", "Category name is required.", 400);
  }

  const normalizedName = normalizeCategoryName(name);
  const existing = await findCategoryByNormalizedName(userId, normalizedName);

  if (existing) {
    throw duplicateCategory();
  }

  try {
    const category = await createCategory({
      name,
      normalizedName,
      type: input.type,
      userId,
    });

    return toCategoryView(category, 0);
  } catch (error) {
    if (isDuplicateKey(error)) {
      throw duplicateCategory();
    }

    throw error;
  }
}

export async function updateCategoryService(
  userId: string,
  categoryId: string,
  input: UpdateCategoryInput,
) {
  assertCategoryId(categoryId);

  const category = await findCategoryByIdAndUserId(categoryId, userId);

  if (!category) {
    throw categoryNotFound();
  }

  const name = input.name === undefined ? category.name : input.name.trim();
  const type = input.type ?? category.type;
  const normalizedName = normalizeCategoryName(name);

  if (!name) {
    throw new AppError("VALIDATION_ERROR", "Category name is required.", 400);
  }

  if (normalizedName !== category.normalizedName) {
    const duplicate = await findCategoryByNormalizedName(userId, normalizedName);

    if (duplicate) {
      throw duplicateCategory();
    }
  }

  if (type !== category.type) {
    const transactionCount = await countTransactionsForCategory(categoryId, userId);

    if (transactionCount > 0) {
      throw new AppError(
        "CATEGORY_IN_USE",
        "This category has transactions, so its type cannot be changed.",
        409,
      );
    }
  }

  try {
    const updated = await updateCategory(categoryId, userId, {
      name,
      normalizedName,
      type,
    });

    if (!updated) {
      throw categoryNotFound();
    }

    const transactionCount = await countTransactionsForCategory(categoryId, userId);
    return toCategoryView(updated, transactionCount);
  } catch (error) {
    if (isDuplicateKey(error)) {
      throw duplicateCategory();
    }

    throw error;
  }
}

export async function deleteCategoryService(userId: string, categoryId: string) {
  assertCategoryId(categoryId);

  const category = await findCategoryByIdAndUserId(categoryId, userId);

  if (!category) {
    throw categoryNotFound();
  }

  const transactionCount = await countTransactionsForCategory(categoryId, userId);

  if (transactionCount > 0) {
    throw new AppError(
      "CATEGORY_IN_USE",
      "This category has transactions, so it cannot be deleted.",
      409,
    );
  }

  const deleted = await deleteCategory(categoryId, userId);

  if (!deleted) {
    throw categoryNotFound();
  }

  return { id: categoryId };
}
