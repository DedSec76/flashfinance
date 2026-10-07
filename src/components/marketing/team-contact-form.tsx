"use client";

import { useState } from "react";
import { teamInboxAddresses } from "@/lib/team";

type Field = "name" | "email" | "message";

type FieldErrors = Partial<Record<Field, string>>;

const limits = {
  name: 80,
  message: 1000,
};

function validate(values: Record<Field, string>): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = "Enter your name.";
  else if (name.length > limits.name) errors.name = `Use ${limits.name} characters or fewer.`;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";

  if (message.length < 10) errors.message = "Write at least 10 characters.";
  else if (message.length > limits.message) errors.message = `Use ${limits.message} characters or fewer.`;

  return errors;
}

export function TeamContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "ready" | "unlisted" | "failed">("idle");

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
  }

  async function handleMailToFailure(rawMessage: string) {
    try {
      await navigator.clipboard.writeText(rawMessage);
      setStatus("failed");
      setErrors((current) => ({
        ...current,
        message: "Your email app did not open. The message was copied to your clipboard instead.",
      }));
      return;
    } catch {
      setStatus("failed");
      setErrors((current) => ({
        ...current,
        message: "Your email app did not open. Please copy the message manually and send it to the team email list.",
      }));
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    const recipients = teamInboxAddresses();
    if (recipients.length === 0) {
      setStatus("unlisted");
      return;
    }

    const subject = "Flash Finance — note for Team 2";
    const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`;
    const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipients.join(","))}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoHref = `mailto:?bcc=${encodeURIComponent(recipients.join(","))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus("ready");
    window.open(gmailHref, "_blank", "noopener,noreferrer");

    window.setTimeout(() => {
      window.location.href = mailtoHref;
    }, 500);
  }

  return (
    <form id="team-message" className="future-form" onSubmit={onSubmit} noValidate>
      <div className="future-fields">
        <div>
          <label htmlFor="team-name">Name</label>
          <input
            id="team-name"
            name="name"
            autoComplete="name"
            maxLength={limits.name}
            value={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "team-name-error" : undefined}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name ? (
            <p id="team-name-error" className="future-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="team-email">Email</label>
          <input
            id="team-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "team-email-error" : undefined}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email ? (
            <p id="team-email-error" className="future-error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="team-body">Message</label>
        <textarea
          id="team-body"
          name="message"
          rows={6}
          maxLength={limits.message}
          value={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "team-body-error" : undefined}
          onChange={(event) => update("message", event.target.value)}
        />
        {errors.message ? (
          <p id="team-body-error" className="future-error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className="future-cta">
        Send to the team
      </button>

      <p className="future-form-status" role="status">
        {status === "ready"
          ? "Your email app is opening with the team message ready to send."
          : status === "failed"
            ? "The email app did not open. Please copy the message manually and send it to the team." 
            : status === "unlisted"
              ? "The team email addresses are not listed yet, so this note cannot be delivered. You can still use each member’s links below."
              : "One note goes to every team email that has been added."}
      </p>
    </form>
  );
}
