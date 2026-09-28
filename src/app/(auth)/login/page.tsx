import { PageHeader } from "@/components/layout/page-header";

export default function LoginPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Sign In" subtitle="Access your private finance workspace." />
      <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600">
        Login form scaffold.
      </div>
    </div>
  );
}
