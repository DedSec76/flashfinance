export function SessionActions() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-900">Session</h2>
      <p className="mt-1 text-sm text-zinc-600">Sign out from this device.</p>
      <button
        type="button"
        className="mt-4 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Sign Out
      </button>
    </section>
  );
}
