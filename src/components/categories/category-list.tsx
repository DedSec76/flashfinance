import { EmptyState } from "@/components/ui/empty-state";

export function CategoryList() {
  const categories: Array<{ id: string; name: string; type: "income" | "expense"; inUse: boolean }> = [];

  if (categories.length === 0) {
    return <EmptyState title="No categories yet" description="Create a category to organize your transactions." />;
  }

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-medium text-zinc-900">{category.name}</p>
            <p className="text-xs capitalize text-zinc-600">{category.type}</p>
          </div>
          <div className="flex gap-2 text-xs">
            <button type="button" className="rounded border border-zinc-300 px-2 py-1 hover:bg-zinc-100">
              Edit
            </button>
            <button
              type="button"
              className="rounded border border-red-300 px-2 py-1 text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={category.inUse}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
