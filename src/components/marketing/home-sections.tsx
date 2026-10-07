"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    index: "01",
    title: "A private account",
    body: "Each person signs in to their own workspace. Records stay with that account.",
  },
  {
    index: "02",
    title: "Income and expenses",
    body: "Add, edit, filter, and remove transactions as the month changes.",
  },
  {
    index: "03",
    title: "Categories you define",
    body: "Group money by the way you earn and spend, with income and expense kept apart.",
  },
  {
    index: "04",
    title: "Monthly balance",
    body: "See income, expenses, and the balance for the month, plus a breakdown by category.",
  },
];

const figures = [
  { label: "Income", value: 2000, tone: "good" },
  { label: "Expenses", value: 500, tone: "bad" },
  { label: "Balance", value: 1500, tone: "mint" },
] as const;

const signals = [
  { value: "01", label: "Account" },
  { value: "02", label: "Money types" },
  { value: "12", label: "Months" },
];

const stream = [
  { kind: "in", label: "Salary", amount: "+$2,000.00" },
  { kind: "out", label: "Groceries", amount: "−$86.40" },
  { kind: "out", label: "Transit", amount: "−$18.00" },
  { kind: "in", label: "Freelance", amount: "+$640.00" },
  { kind: "out", label: "Rent", amount: "−$395.60" },
];

function useShown<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShown(true);
      },
      { threshold: 0.28 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
}

function useCount(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 1400);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function money(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function Figure({
  label,
  value,
  tone,
  active,
}: {
  label: string;
  value: number;
  tone: string;
  active: boolean;
}) {
  const current = useCount(value, active);

  return (
    <div className="future-figure">
      <p className="future-kicker">{label}</p>
      <p className={`future-value ${tone}`}>{money(current)}</p>
    </div>
  );
}

export function HomeSections() {
  const telemetry = useShown<HTMLElement>();
  const deck = useShown<HTMLElement>();
  const loop = [...stream, ...stream];

  return (
    <div className="future">
      <section
        ref={telemetry.ref}
        className={`future-telemetry ${telemetry.shown ? "is-shown" : ""}`}
        aria-label="Sample month"
      >
        <div className="future-telemetry-glow" aria-hidden="true" />
        {figures.map((figure) => (
          <Figure key={figure.label} {...figure} active={telemetry.shown} />
        ))}
        <Link href="/register" className="future-cta">
          Start tracking
        </Link>
        <p className="future-note">Sample September figures from a single account.</p>
      </section>

      <section ref={deck.ref} className={`future-deck ${deck.shown ? "is-shown" : ""}`}>
        <p className="future-status">
          <span className="future-dot" aria-hidden="true" />
          Ledger · sample month · private node
        </p>

        <div className="future-headline">
          <h2 className="future-display">
            We make the month <span className="future-hot">readable.</span>
          </h2>
          <p className="future-lead">
            Income, expenses, and categories stay in one private place, so the balance at the end of
            the month is easy to see.
          </p>
        </div>

        <dl className="future-signals">
          {signals.map((signal, index) => (
            <div key={signal.label} style={{ animationDelay: `${index * 120}ms` }}>
              <dt>{signal.value}</dt>
              <dd>{signal.label}</dd>
            </div>
          ))}
        </dl>

        <div className="future-cards">
          {features.map((feature, index) => (
            <article key={feature.title} className="future-card" style={{ animationDelay: `${180 + index * 110}ms` }}>
              <span className="future-index">{feature.index}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>

        <div className="future-rail" aria-hidden="true">
          <div className="future-rail-track">
            {loop.map((item, index) => (
              <span key={`${item.label}-${index}`} className={item.kind}>
                <i />
                {item.label}
                <b>{item.amount}</b>
              </span>
            ))}
          </div>
        </div>

        <Link href="/about" className="future-more">
          More details
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
