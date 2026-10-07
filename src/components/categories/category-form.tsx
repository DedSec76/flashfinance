export function CategoryForm() {
  return (
    <form className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="grid gap-1">
        <label htmlFor="category-name" className="text-sm font-medium text-zinc-800">
          Category Name
        </label>
        <input id="category-name" type="text" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div className="grid gap-1">
        <label htmlFor="category-type" className="text-sm font-medium text-zinc-800">
          Type
        </label>
        <select id="category-type" className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
          <option>income</option>
          <option>expense</option>
        </select>
      </div>
      <button type="submit" className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
        Save Category
      </button>
    </form>
  );
}
