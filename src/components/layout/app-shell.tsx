import { Header } from "@/src/components/layout/header";
import { SidebarNav } from "@/src/components/layout/sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <SidebarNav />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
