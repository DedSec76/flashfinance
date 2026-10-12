import { AppFrame } from "@/components/layout/app-frame";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <AppFrame>{children}</AppFrame>
    </div>
  );
}
