'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />
      <Hero />
      <SectionOne />
      <SectionTwo />
      <CTA />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight">Pitch Guru</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm text-white/70 hover:text-white" href="#features">
            1) Features
          </a>
          <a className="text-sm text-white/70 hover:text-white" href="#pricing">
            2) Pricing
          </a>
        </nav>

        <a
          href="#cta"
          className="inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Early Access
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Baseball-ish background: field gradient + subtle lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.20),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_35%,rgba(0,0,0,0.35))]" />
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rotate-45 rounded-3xl border border-white/10 bg-white/5" />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              Built for game-day tracking
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
                BETA
              </span>
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Track every pitch.
              <br />
              <span className="text-white/70">Ditch the scorebook.</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-white/75 md:text-lg">
              Pitch Guru gives coaches a fast, clean way to log balls, strikes, whiffs, and in-play contact — then
              instantly shows the metrics that matter in the dugout.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#cta"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Request early access
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
              >
                1) See features
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/60">
              <Pill>High school</Pill>
              <Pill>Travel</Pill>
              <Pill>JuCo / NAIA</Pill>
              <Pill>College bullpens</Pill>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-sm">
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Dugout Dashboard</p>
                  <p className="text-xs text-white/60">Live inning-by-inning</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-200">
                  Recording
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Metric label="Strike %" value="67%" />
                <Metric label="Whiff rate" value="32%" />
                <Metric label="1st pitch strike" value="71%" />
                <Metric label="Pitches / inning" value="14.8" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <ActionButton primary>Strike</ActionButton>
                <ActionButton>Ball</ActionButton>
                <ActionButton>Whiff</ActionButton>
                <ActionButton>In play</ActionButton>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-xs font-semibold text-white/80">Pitcher: #18 RHP</p>
                <p className="mt-1 text-xs text-white/65">
                  Read: whiff rate up in innings 3–4. Attack up & in.
                </p>
              </div>

              {/* subtle "stitch" line */}
              <div className="mt-4 h-px w-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_10px,transparent_10px,transparent_18px)]" />
              <p className="mt-3 text-xs text-white/55">
                Fast inputs. Clean outputs. Built for the dugout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionOne() {
  const cards = [
    {
      title: "One-tap pitch logging",
      desc: "Ball, strike, whiff, in-play — designed to be as fast as a book.",
    },
    {
      title: "Auto-calculated metrics",
      desc: "Strike %, whiff rate, 1st pitch strike %, pitches/inning — updated instantly.",
    },
    {
      title: "Pitcher profiles + trends",
      desc: "See outing history and what’s improving (or slipping) over time.",
    },
    {
      title: "Coach-ready reports",
      desc: "Share a clean post-game recap with staff, players, or parents.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <SectionLabel n="1" title="Features" subtitle="Everything you need. Nothing you don’t." />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07]"
          >
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <BigStat value="< 2 min" label="Setup time" />
        <BigStat value="1 tap" label="Per pitch" />
        <BigStat value="Instant" label="Post-game recap" />
        <BigStat value="Clean" label="Shareable reports" />
      </div>
    </section>
  );
}

function SectionTwo() {
  const tiers = [
    {
      name: "Starter",
      price: "$0",
      note: "Try it out",
      features: ["1 team", "Basic tracking", "Post-game summary"],
    },
    {
      name: "Team",
      price: "$19/mo",
      note: "Most popular",
      features: ["Unlimited games", "Trends", "Exports", "Coach dashboard"],
      featured: true,
    },
    {
      name: "Program",
      price: "Custom",
      note: "Multiple teams",
      features: ["Multi-team admin", "Priority support", "Custom exports", "Onboarding"],
    },
  ];

  return (
    <section id="pricing" className="border-y border-white/10 bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <SectionLabel n="2" title="Pricing" subtitle="Simple, coach-friendly plans." />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={[
                "rounded-2xl border p-6",
                t.featured
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                  <p className="text-sm text-white/60">{t.note}</p>
                </div>
                {t.featured && (
                  <span className="rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-slate-950">
                    Popular
                  </span>
                )}
              </div>

              <p className="mt-4 text-3xl font-bold">{t.price}</p>

              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 inline-block h-4 w-4 rounded-sm bg-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={[
                  "mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold",
                  t.featured
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : "border border-white/15 text-white hover:bg-white/5",
                ].join(" ")}
              >
                Get early access
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="bg-emerald-500 py-16 text-slate-950">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl bg-slate-950 px-6 py-10 text-white md:px-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold">Get Pitch Guru for your team</h2>
              <p className="mt-3 text-white/70">
                Drop your email for beta access. We’ll reach out with the first invite.
              </p>
            </div>

            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Submitted! Next step: connect this to a real email capture.");
              }}
            >
              <input
                type="email"
                required
                placeholder="coach@school.edu"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-emerald-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Request access
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">© {new Date().getFullYear()} Pitch Guru. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-white/60">
            <a className="hover:text-white" href="#features">1) Features</a>
            <a className="hover:text-white" href="#pricing">2) Pricing</a>
            <a className="hover:text-white" href="#cta">Early access</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- UI bits ---------- */

function SectionLabel({ n, title, subtitle }: { n: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-slate-950">
          {n}
        </span>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <p className="mt-3 text-white/70">{subtitle}</p>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
      {children}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950 p-3">
      <p className="text-xs font-medium text-white/55">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "rounded-lg px-4 py-3 text-sm font-semibold transition",
        primary
          ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
          : "border border-white/15 text-white hover:bg-white/5",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-white/60">{label}</p>
    </div>
  );
}

function LogoMark() {
  // Baseball diamond-inspired mark (clean + sporty)
  return (
    <div className="relative h-9 w-9 rounded-xl border border-white/10 bg-white/5">
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-md border border-white/20 bg-slate-950" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400" />
    </div>
  );
}
