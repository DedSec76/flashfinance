import type { Metadata } from "next";
import { PageHeader } from "@/src/components/layout/page-header";
import { PasswordChangeForm } from "@/src/components/profile/password-change-form";
import { ProfileForm } from "@/src/components/profile/profile-form";
import { SessionActions } from "@/src/components/profile/session-actions";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your personal information and account settings.",
};
export default function ProfilePage() {
  return (
    <div className="page-stack">
      <PageHeader title="Profile" subtitle="Manage account details and security settings." />
      <ProfileForm />
      <PasswordChangeForm />
      <SessionActions />
    </div>
  );
}
