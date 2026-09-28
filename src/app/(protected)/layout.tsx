import { AuthGuard } from "@/src/components/auth/auth-guard";
import { AppShell } from "@/src/components/layout/app-shell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
