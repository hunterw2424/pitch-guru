"use client";

export default function PitchersPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold">Pitchers</h1>
        <p className="mt-2 text-white/70">Coming next — pitcher profiles & history.</p>
        <a className="mt-6 inline-block text-emerald-400 hover:text-emerald-300" href="/app">
          ← Back to dashboard
        </a>
      </div>
    </main>
  );
}
