import { AuthHero } from "@/components/auth/auth-hero";
import { AuthScene } from "@/components/auth/auth-scene";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-screen">
      <AuthScene />
      <div className="auth-shell">
        <AuthHero />
        <section className="auth-panel">{children}</section>
      </div>
    </div>
  );
}
