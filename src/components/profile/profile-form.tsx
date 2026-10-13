"use client";

import { Profile } from "@/types/profile";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";

export function ProfileForm() {
  const { setUser } = useUser();

  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null); 

        if (!response.ok) {
          throw new Error(data?.error?.message ?? "Could not load your profile.");
        }

        if (!cancelled) {
          setProfile({
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error 
              ? err.message 
              : "An unexpected error occurred.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error?.message ?? "Could not save your profile.",
        );
      }

      setProfile((current) => ({
        ...current,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? current.email,
      }));

      setUser((current) => 
        current
          ? {
            ...current, 
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email ?? current.email
          }
          : current
      )

      setSuccess("Profile updated successfully");
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

  if (loading) {
    return (
      <section className="card form-panel">
        <h2>Profile details</h2>
        <p>Loading profile</p>
      </section>
    )
  }

  return (
    <form className="card form-panel" onSubmit={handleSubmit}>
      <h2>Profile details</h2>

      {error && (
        <p role="alert" aria-live="polite">{error}</p>
      )}

      {success && (
        <p className="rounded-md bg-blue-50 py-2 text-blue-600 text-center" role="status" aria-live="polite">{success}</p>
      )}

      <div className="form-group">
        <label htmlFor="profile-first-name">First name</label>
        <input 
          id="profile-first-name" 
          name="firstName" 
          type="text" 
          autoComplete="given-name" 
          minLength={2}
          maxLength={80}
          required
          value={profile.firstName}
          onChange={(e) => 
            setProfile((current) => ({
              ...current,
              firstName: e.target.value,
            }))
          }
          disabled={saving}
        />
      </div>

      <div className="form-group">
        <label htmlFor="profile-last-name">Last name</label>
        <input
          id="profile-last-name"
          name="lastName"
          type="text"
          autoComplete="family-name"
          minLength={2}
          maxLength={80}
          required
          value={profile.lastName}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              lastName: event.target.value,
            }))
          }
          disabled={saving}
        />
      </div>

      <div className="form-group">
        <label htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          name="email"
          type="email"
          autoComplete="email"
          value={profile.email}
          readOnly
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." :"Save profile"}
        </button>
      </div>
    </form>
  );
}
