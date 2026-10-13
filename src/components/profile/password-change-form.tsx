"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error?.message ?? "Could not update your password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setSuccess("Password updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "An unexpected error occurred.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form-panel" onSubmit={handleSubmit}>
      <h2>Change password</h2>

      {error && (
        <p className="rounded-md py-2 text-center bg-red-50 text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-md py-2 text-center bg-blue-50 text-blue-600" role="status" aria-live="polite">
          {success}
        </p>
      )}

      <div className="form-group">
        <label htmlFor="current-password">Current password</label>
        
        <div className="relative">
          <input 
            id="current-password" 
            name="currentPassword" 
            type={showCurrentPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)} 
            disabled={saving}
            className="w-full pr-24"  
          />

          <button 
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            aria-label={
              showCurrentPassword
                ? "Hide current password"
                : "Show current password"
            }
            aria-pressed={showCurrentPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            {showCurrentPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="new-password">New password</label>
        <div className="relative">
          <input 
            id="new-password" 
            name="newPassword" 
            type={showNewPassword ? "text" : "password"} 
            autoComplete="new-password"
            minLength={10}
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={saving}
          />

          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            aria-label={
              showNewPassword
                ? "Hide new password"
                : "Show new password"
            }
            aria-pressed={showNewPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            {showNewPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
        <p className="text-sm">
          At least 10 characters, one uppercase letter, one number,
          and one special character.
        </p>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Updating..." : "Update password"}
        </button>
      </div>
    </form>
  );
}
