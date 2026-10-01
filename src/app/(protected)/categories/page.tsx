import { CategoryForm } from "@/components/categories/category-form";
import { CategoryList } from "@/components/categories/category-list";
import { PageHeader } from "@/components/layout/page-header";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" subtitle="Create and maintain your transaction categories." />
      <CategoryForm />
      <CategoryList />
    </div>
  );
}
