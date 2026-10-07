"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  authAlertClass,
  authButtonClass,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authLegalClass,
  authLinkClass,
} from "@/components/auth/auth-classes";
import { readAuthError } from "@/components/auth/auth-response";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const emptyForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validateName(value: string, label: string) {
    if (!value.trim()) {
      return `${label} is required.`;
    }

    if (value.trim().length < 2) {
      return `${label} must be at least 2 characters.`;
    }

    return "";
  }

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

  function validateForm(nextForm: RegisterForm): RegisterErrors {
    return {
      firstName: validateName(nextForm.firstName, "First name"),
      lastName: validateName(nextForm.lastName, "Last name"),
      email: validateEmail(nextForm.email),
      password: validatePassword(nextForm.password),
      confirmPassword: validateConfirmPassword(
        nextForm.confirmPassword,
        nextForm.password,
      ),
    };
  }

  function handleChange(field: keyof RegisterForm, value: string) {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    if (errors[field] || (field === "password" && errors.confirmPassword)) {
      setErrors(validateForm(nextForm));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setSubmitError("Please correct the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      if (!registerResponse.ok) {
        const failure = await readAuthError(registerResponse);
        const fieldErrors: RegisterErrors = {
          firstName: failure.fields.firstName,
          lastName: failure.fields.lastName,
          email: failure.fields.email,
          password: failure.fields.password,
        };

        if (Object.values(fieldErrors).some(Boolean)) {
          setErrors(fieldErrors);
          setSubmitError(
            "Please correct the highlighted fields and try again.",
          );
          return;
        }

        setSubmitError(failure.message);
        return;
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      if (!loginResponse.ok) {
        setSubmitError(
          "Your account was created, but sign-in did not complete. Sign in with your email and password.",
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setSubmitError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-form-wrap">
      <div>
        <h2>Create account</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="firstName" className={authLabelClass}>
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(event) =>
                handleChange("firstName", event.target.value)
              }
              className={authInputClass}
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              disabled={submitting}
            />
            {errors.firstName ? (
              <p className={authErrorClass}>{errors.firstName}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="lastName" className={authLabelClass}>
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              className={authInputClass}
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              disabled={submitting}
            />
            {errors.lastName ? (
              <p className={authErrorClass}>{errors.lastName}</p>
            ) : null}
          </div>

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
              disabled={submitting}
            />
            {errors.email ? (
              <p className={authErrorClass}>{errors.email}</p>
            ) : null}
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
              disabled={submitting}
            />
            {errors.password ? (
              <p className={authErrorClass}>{errors.password}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword" className={authLabelClass}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                handleChange("confirmPassword", event.target.value)
              }
              className={authInputClass}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              disabled={submitting}
            />
            {errors.confirmPassword ? (
              <p className={authErrorClass}>{errors.confirmPassword}</p>
            ) : null}
          </div>

          <p className="auth-hint">
            Use at least 10 characters, with 1 uppercase letter, 1 number, and 1
            symbol.
          </p>

          {submitError ? <p className={authAlertClass}>{submitError}</p> : null}

          <button
            type="submit"
            className={authButtonClass}
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create account"}
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
