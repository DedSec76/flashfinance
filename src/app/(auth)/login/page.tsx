"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetHint, setShowResetHint] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [submitError, setSubmitError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => {
        if (!active) {
          return;
        }

        if (response.ok) {
          router.replace("/dashboard");
          return;
        }

        setCheckingSession(false);
      })
      .catch(() => {
        if (active) {
          setCheckingSession(false);
        }
      });

    return () => {
      active = false;
    };
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nextErrors = { email: emailError, password: passwordError };

    setErrors(nextErrors);

    if (emailError || passwordError) {
      setSubmitError("Please correct the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const failure = await readAuthError(response);
        const emailMessage = failure.fields.email ?? "";
        const passwordMessage = failure.fields.password ?? "";

        if (emailMessage || passwordMessage) {
          setErrors({ email: emailMessage, password: passwordMessage });
          setSubmitError(
            "Please correct the highlighted fields and try again.",
          );
          return;
        }

        setSubmitError(failure.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setSubmitError("Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-form-wrap">
      <div>
        <h2>Sign in</h2>

        {checkingSession ? (
          <p className="auth-hint">Checking your session...</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email" className={authLabelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email) {
                    setErrors((current) => ({
                      ...current,
                      email: validateEmail(event.target.value),
                    }));
                  }
                }}
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
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password) {
                    setErrors((current) => ({
                      ...current,
                      password: validatePassword(event.target.value),
                    }));
                  }
                }}
                className={authInputClass}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                disabled={submitting}
              />
              {errors.password ? (
                <p className={authErrorClass}>{errors.password}</p>
              ) : null}
            </div>

            {submitError ? (
              <p className={authAlertClass}>{submitError}</p>
            ) : null}

            <button
              type="submit"
              className={authButtonClass}
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in now"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => setShowResetHint(true)}
          className="auth-text-button"
        >
          Lost your password?
        </button>
        {showResetHint ? (
          <p className="auth-hint">
            Contact the team and include the email on your account. They can
            look up your account and help you recover access.{" "}
            <Link href="/contact" className={authLinkClass}>
              Contact the team
            </Link>
          </p>
        ) : null}

        <p className="auth-switch">
          New here?{" "}
          <Link href="/register" className={authLinkClass}>
            Create an account
          </Link>
        </p>
      </div>

      <p className={authLegalClass}>
        By clicking on &quot;Sign in now&quot; you agree to
        <br />
        <span className={authLinkClass}>Terms of Service</span>
        {" | "}
        <span className={authLinkClass}>Privacy Policy</span>
      </p>
    </div>
  );
}
