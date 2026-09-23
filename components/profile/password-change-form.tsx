export function PasswordChangeForm() {
  return (
    <form className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-900">Change Password</h2>
      <div className="grid gap-1">
        <label htmlFor="current-password" className="text-sm font-medium text-zinc-800">
          Current Password
        </label>
        <input id="current-password" type="password" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div className="grid gap-1">
        <label htmlFor="new-password" className="text-sm font-medium text-zinc-800">
          New Password
        </label>
        <input id="new-password" type="password" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
        Update Password
      </button>
    </form>
  );
}
