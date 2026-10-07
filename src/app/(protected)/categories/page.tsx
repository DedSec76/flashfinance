import { CategoryManager } from "@/src/components/categories/category-manager";
import { PageHeader } from "@/src/components/layout/page-header";
import { ErrorState } from "@/src/components/ui/error-state";
import { getCurrentUserId } from "@/src/lib/auth/current-user";
import { AppError } from "@/src/lib/errors/app-error";
import {
  listCategoriesService,
  type CategoryView,
} from "@/src/services/category/category.service";

function failureMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default async function CategoriesPage() {
  let categories: CategoryView[] | null = null;
  let loadError = "";

  try {
    const userId = await getCurrentUserId();
    categories = await listCategoriesService(userId);
  } catch (error) {
    loadError = failureMessage(error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Create and maintain your transaction categories."
      />
      {loadError ? <ErrorState message={loadError} /> : null}
      {categories ? <CategoryManager categories={categories} /> : null}
    </div>
  );
}
