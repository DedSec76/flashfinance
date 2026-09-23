import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f7fb] text-slate-800">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <SidebarNav />
        <main className="flex-1 bg-transparent p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
