import { PageHeader } from "@/components/layout/page-header";
import { PasswordChangeForm } from "@/components/profile/password-change-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { SessionActions } from "@/components/profile/session-actions";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Manage account details and security settings." />
      <ProfileForm />
      <PasswordChangeForm />
      <SessionActions />
    </div>
  );
}
