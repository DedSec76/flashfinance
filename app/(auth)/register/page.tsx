import { PageHeader } from "@/components/layout/page-header";

export default function RegisterPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Create Account"
        subtitle="Set up your account to track income and expenses."
      />
      <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600">
        Registration form scaffold.
      </div>
    </div>
  );
}
