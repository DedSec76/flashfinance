"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { setAuthenticated } from "@/components/auth/auth-guard";
import { PageHeader } from "@/components/layout/page-header";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [submitError, setSubmitError] = useState("");

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

  function validateConfirmPassword(value: string, password: string) {
    if (!value) {
      return "Please confirm your password.";
    }

    if (value !== password) {
      return "Passwords do not match.";
    }

    return "";
  }

  function handleChange(field: "email" | "password" | "confirmPassword", value: string) {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    if (errors[field]) {
      const emailError = field === "email" ? validateEmail(value) : errors.email ?? "";
      const passwordError = field === "password" ? validatePassword(value) : validatePassword(nextForm.password);
      const confirmError =
        field === "confirmPassword"
          ? validateConfirmPassword(value, nextForm.password)
          : validateConfirmPassword(nextForm.confirmPassword, nextForm.password);

      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmError,
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(form.confirmPassword, form.password);

    const nextErrors = {
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    setErrors(nextErrors);

    if (emailError || passwordError || confirmPasswordError) {
      setSubmitError("Please correct the highlighted fields and try again.");
      return;
    }

    setSubmitError("");
    setAuthenticated(true);
    router.replace("/dashboard");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Create Account"
        subtitle="Set up your account to track income and expenses."
      />

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
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
            value={form.password}
            onChange={(event) => handleChange("password", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            placeholder="At least 10 characters"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => handleChange("confirmPassword", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            placeholder="Repeat your password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-red-600">{errors.confirmPassword}</p>
          ) : null}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
          Password must be at least 10 characters, include 1 uppercase letter, 1 number, and 1 symbol.
        </div>

        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
