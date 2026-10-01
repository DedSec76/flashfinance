import Link from "next/link";

const ledgerLetters = "TRACKEVERYDOLLAR".split("");

export function HomeHero() {
  return (
    <section className="hero-screen relative isolate min-h-[100svh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/marketing/hero-forest.jpg)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(46,24,72,0.78)_0%,rgba(36,22,58,0.5)_48%,rgba(22,16,36,0.25)_100%)]" />
      <svg className="hero-rule" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="58" y1="0" x2="6" y2="74" stroke="white" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="hero-copy relative min-h-[100svh]">
        <div className="hero-title-wrap">
          <h1 className="hero-title">
            <span className="block">Track</span>
            <span className="line-two">Clearly</span>
          </h1>
        </div>

        <p className="hero-aside text-sm leading-6">
          Flash Finance is a private ledger. Record income and expenses, then see the balance for
          the month.
        </p>

        <div className="hero-bottom">
          <p
            aria-label="Track every dollar"
            className="grid w-fit grid-cols-4 gap-x-3 gap-y-1.5 text-[11px] tracking-[0.22em]"
          >
            {ledgerLetters.map((letter, index) => (
              <span key={`${letter}-${index}`}>{letter}</span>
            ))}
          </p>

          <div className="max-w-xs">
            <span className="mb-4 block h-px w-10 bg-white" />
            <p className="text-sm leading-6">
              Each account keeps its own categories, transactions, and monthly balance.
            </p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] uppercase hover:underline"
            >
              Create your account
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
