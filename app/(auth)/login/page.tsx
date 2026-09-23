"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { isAuthenticated, setAuthenticated } from "@/components/auth/auth-guard";
import { PageHeader } from "@/components/layout/page-header";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  function validateEmail(value: string) {
    if (!value.trim()) {
      return "Email is required.";
    }

    if (!emailPattern.test(value.trim())) {
      return "Enter a valid email address such as user.name@example.com.";
    }

    return "";
  }

  function validatePassword(value: string) {
    if (!value) {
      return "Password is required.";
    }

    if (value.length < 10) {
      return "Password must be at least 10 characters long.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must include at least one uppercase letter.";
    }

    if (!/\d/.test(value)) {
      return "Password must include at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must include at least one symbol.";
    }

    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const nextErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(nextErrors);

    if (emailError || passwordError) {
      setSubmitError("Please correct the highlighted fields and try again.");
      return;
    }

    setAuthenticated(true);
    setSubmitError("");
    router.replace("/dashboard");
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Sign In" subtitle="Access your private finance workspace." />

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) {
                setErrors((current) => ({ ...current, email: validateEmail(event.target.value) }));
              }
            }}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            placeholder="user.name@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) {
                setErrors((current) => ({ ...current, password: validatePassword(event.target.value) }));
              }
            }}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            placeholder="At least 10 characters"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
          Password requirements: 10+ characters, 1 uppercase letter, 1 number, and 1 symbol.
        </div>

        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Need an account?{" "}
        <Link href="/register" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
