"use client";

import { usePathname } from "next/navigation";

const description =
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using";

export function AuthHero() {
  const pathname = usePathname();
  const isRegister = pathname.startsWith("/register");

  return (
    <section className="auth-hero">
      <h1>
        {isRegister ? (
          <>
            Create
            <br />
            Account
          </>
        ) : (
          <>
            Welcome
            <br />
            Back
          </>
        )}
      </h1>
      <p className="auth-lead">{description}</p>
      <div className="auth-socials" aria-hidden="true">
        <SocialIcon>
          <path d="M14.2 8.5h2.5V5.7h-2.5c-1.8 0-3.2 1.5-3.2 3.3v1.7H8.5V14h2.5v7.2h3V14h2.4l.4-3.3h-2.8V9.5c0-.6.4-1 1-1h1.2z" />
        </SocialIcon>
        <SocialIcon>
          <path d="M21.5 6.1c-.6.3-1.3.5-2 .6.7-.4 1.3-1.1 1.5-1.9-.7.4-1.4.7-2.2.9A3.5 3.5 0 0 0 12.3 8c0 .3 0 .5.1.8-2.9-.1-5.5-1.5-7.2-3.7-.3.5-.5 1.1-.5 1.8 0 1.2.6 2.3 1.6 2.9-.6 0-1.1-.2-1.6-.4 0 1.7 1.2 3.1 2.8 3.5-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.7 2.4 3.2 2.4A7 7 0 0 1 3 17.6a9.9 9.9 0 0 0 5.4 1.6c6.4 0 10-5.3 10-10v-.5c.7-.5 1.3-1.1 1.8-1.8-.6.3-1.3.5-2 .6z" />
        </SocialIcon>
        <SocialIcon>
          <path
            fillRule="evenodd"
            d="M8 4.5h8A3.5 3.5 0 0 1 19.5 8v8a3.5 3.5 0 0 1-3.5 3.5H8A3.5 3.5 0 0 1 4.5 16V8A3.5 3.5 0 0 1 8 4.5zm4 3.1a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm0 1.6a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM16.7 8.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
          />
        </SocialIcon>
        <SocialIcon>
          <path d="M22.5 12.2s0-3-.4-4.3c-.2-.8-.8-1.5-1.6-1.7C19 5.8 12 5.8 12 5.8s-7 0-8.5.4c-.8.2-1.4.9-1.6 1.7C1.5 9.2 1.5 12.2 1.5 12.2s0 3 .4 4.3c.2.8.8 1.5 1.6 1.7 1.5.4 8.5.4 8.5.4s7 0 8.5-.4c.8-.2 1.4-.9 1.6-1.7.4-1.3.4-4.3.4-4.3zM9.9 15.4V9l6 3.2-6 3.2z" />
        </SocialIcon>
      </div>
    </section>
  );
}

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="auth-social">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}
