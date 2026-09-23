import Link from "next/link";

const featureCards = [
  {
    title: "Smart cashflow visibility",
    description: "Track spending, income, and monthly performance in one intelligent workspace.",
    glow: "bg-[#8b5cf6]",
  },
  {
    title: "Auto-categorized insights",
    description: "Spot category trends and uncover where your money is moving before the month ends.",
    glow: "bg-[#22c55e]",
  },
  {
    title: "Private financial command",
    description: "Your personal data stays protected with secure account-based access and user controls.",
    glow: "bg-[#38bdf8]",
  },
];

const heroStats = [
  { label: "Monthly budget saved", value: "$18.4K" },
  { label: "Active users", value: "24.8K" },
  { label: "Automation rate", value: "94%" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020b17] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute left-12 top-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-[100px]" />
        <div className="absolute right-16 top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-52 w-52 rounded-full bg-emerald-400/15 blur-[110px]" />

        <header className="relative z-10 mx-auto flex max-w-[1280px] items-center justify-between px-6 py-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#60a5fa] via-[#6d7ef6] to-[#8b5cf6] text-base font-black text-white shadow-[0_0_24px_rgba(96,165,250,0.75)]">
              F
            </div>
            <span className="text-[0.84rem] font-semibold tracking-[0.25em] text-slate-100">FLASHFINANCE</span>
          </div>

          <nav className="hidden items-center gap-8 text-[0.72rem] font-medium text-slate-300 md:flex">
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#insights" className="transition hover:text-white">Insights</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.72rem] font-medium text-slate-100 transition hover:bg-white/[0.08]">
              Sign In
            </Link>
            <Link href="/register" className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-4 py-2 text-[0.72rem] font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.6)] transition hover:brightness-110">
              Create Account
            </Link>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-[1280px] px-6 pb-12 pt-8 lg:px-8 lg:pb-16 lg:pt-8">
          <section className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="pt-2">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Finance reimagined
              </div>

              <h1 className="max-w-[620px] text-[2.7rem] font-black leading-[0.95] tracking-[-0.08em] text-white md:text-[3.6rem] lg:text-[4rem]">
                Build wealth with a smarter financial flow.
              </h1>

              <p className="mt-5 max-w-[560px] text-[1.02rem] leading-7 text-slate-300">
                Monitor inflow, cut waste, and turn spending into momentum with an AI-enhanced dashboard designed for modern money habits.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/register" className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_32px_rgba(59,130,246,0.55)] transition hover:brightness-110">
                  Get Started
                </Link>
                <Link href="/login" className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/[0.08]">
                  See Dashboard
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6">
                {heroStats.map(({ label, value }) => (
                  <div key={label} className="min-w-[120px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
                    <div className="text-[1.1rem] font-bold text-white">{value}</div>
                    <div className="mt-1 text-[0.7rem] uppercase tracking-[0.1em] text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[600px] rounded-[26px] border border-white/10 bg-[#081522]/80 p-3 shadow-[0_25px_80px_rgba(8,20,33,0.9)] backdrop-blur-xl">
                <div className="rounded-[20px] border border-white/10 bg-[#0b1630]/90 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[0.62rem] uppercase tracking-[0.26em] text-slate-400">Portfolio</div>
                      <div className="mt-2 text-[1.9rem] font-bold text-white">$84,260</div>
                    </div>
                    <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-medium text-emerald-300">
                      +12.4%
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0a1020] p-4">
                    <div className="mb-4 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-slate-400">
                      <span>Cash flow</span>
                      <span>Q3</span>
                    </div>

                    <div className="flex h-32 items-end gap-2">
                      {[40, 52, 44, 73, 59, 86, 96].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-[10px] bg-gradient-to-t from-[#38bdf8] via-[#60a5fa] to-[#8b5cf6]"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">Income</div>
                      <div className="mt-2 text-[1.5rem] font-bold text-emerald-300">$8,420</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">Expenses</div>
                      <div className="mt-2 text-[1.5rem] font-bold text-red-300">$4,960</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <section id="about" className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <div className="mb-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              About the platform
            </div>
            <h2 className="text-[2.1rem] font-black leading-tight tracking-[-0.06em] text-white">
              A future-ready money system.
            </h2>
            <p className="mt-5 max-w-[540px] text-[1rem] leading-8 text-slate-300">
              Flash Finance brings together smart budgeting, transparent insights, and a frictionless workflow so everyday decisions feel more strategic and less stressful.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Saved monthly", "$22.6K"],
              ["Budget health", "97%"],
              ["Automation", "24/7"],
              ["Insights", "Live"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] border border-white/10 bg-[#071521] p-5">
                <div className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">{label}</div>
                <div className="mt-3 text-[1.8rem] font-bold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1280px] px-6 py-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-violet-200">
            Why teams switch
          </div>
          <h2 className="mt-5 text-[2.1rem] font-black tracking-[-0.06em] text-white">
            Built for clarity, momentum, and control.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featureCards.map(({ title, description, glow }) => (
            <div key={title} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
              <div className={`${glow} mb-5 h-10 w-10 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.5)]`} />
              <h3 className="text-[1.2rem] font-bold text-white">{title}</h3>
              <p className="mt-3 text-[0.96rem] leading-7 text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="insights" className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#091624] via-[#091b2f] to-[#081521] p-8 shadow-[0_24px_80px_rgba(37,99,235,0.13)]">
          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                Performance pulse
              </div>
              <h2 className="mt-5 text-[2.2rem] font-black leading-tight tracking-[-0.06em] text-white">
                Turn numbers into action.
              </h2>
              <p className="mt-4 max-w-[520px] text-[1rem] leading-8 text-slate-300">
                Get instant visibility into your balance, projections, and major spending shifts without the clutter of legacy banking tools.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#0b1622] p-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">Savings</div>
                  <div className="mt-3 text-[1.7rem] font-bold text-emerald-300">$12.8K</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1622] p-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">Goals</div>
                  <div className="mt-3 text-[1.7rem] font-bold text-cyan-300">84%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1622] p-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">Risk</div>
                  <div className="mt-3 text-[1.7rem] font-bold text-violet-300">Low</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1280px] px-6 pb-24 lg:px-8">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Ready to begin
          </div>
          <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.06em] text-white">
            Design a smarter money life.
          </h2>
          <p className="mt-4 text-[1rem] text-slate-300">
            Start with a cleaner budget, sharper insight, and a dashboard built for momentum.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] transition hover:brightness-110">
              Start free
            </Link>
            <Link href="/login" className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/[0.08]">
              Log in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
