"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { setAuthenticated } from "@/components/auth/auth-guard";
import {
  authAlertClass,
  authButtonClass,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authLegalClass,
  authLinkClass,
} from "@/components/auth/auth-classes";

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
    <div className="auth-form-wrap">
      <div>
        <h2>Create account</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email" className={authLabelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className={authInputClass}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <p className={authErrorClass}>{errors.email}</p> : null}
          </div>

          <div className="auth-field">
            <label htmlFor="password" className={authLabelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className={authInputClass}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? <p className={authErrorClass}>{errors.password}</p> : null}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword" className={authLabelClass}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(event) => handleChange("confirmPassword", event.target.value)}
              className={authInputClass}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword ? <p className={authErrorClass}>{errors.confirmPassword}</p> : null}
          </div>

          <p className="auth-hint">Use at least 10 characters, with 1 uppercase letter, 1 number, and 1 symbol.</p>

          {submitError ? <p className={authAlertClass}>{submitError}</p> : null}

          <button type="submit" className={authButtonClass}>
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login" className={authLinkClass}>
            Sign in
          </Link>
        </p>
      </div>

      <p className={authLegalClass}>
        By clicking on &quot;Create account&quot; you agree to
        <br />
        <span className={authLinkClass}>Terms of Service</span>
        {" | "}
        <span className={authLinkClass}>Privacy Policy</span>
      </p>
    </div>
  );
}
