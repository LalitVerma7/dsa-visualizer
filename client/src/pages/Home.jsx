import { Link } from "react-router-dom";

const PREVIEW_VALUES = [64, 34, 25, 12, 22];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-signal-purple/20 blur-[140px]" />

      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-850 px-4 py-1.5 font-mono text-xs text-signal-purple">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-mint" />
          Data Structures &amp; Algorithms, visualized
        </span>

        <h1 className="font-display text-4xl font-semibold leading-[1.08] text-ink-50 sm:text-6xl">
          Watch algorithms
          <br />
          <span className="text-signal-purple">think, compare, and learn.</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base text-ink-300 sm:text-lg">
          Stop reading pseudocode in silence. Step through real Java code line by line, in sync
          with a live animation of every comparison and swap.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/topics"
            className="rounded-xl bg-signal-purple px-7 py-3.5 font-display text-base font-semibold text-ink-950 shadow-glow transition hover:brightness-110"
          >
            Start your DSA journey
          </Link>
          
        </div>

        {/* mini static preview of the visualizer style */}
        <div className="mt-20 flex items-end gap-3 rounded-2xl border border-ink-700 bg-ink-900 bg-dot-grid px-8 py-10">
          {PREVIEW_VALUES.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 font-display text-lg font-semibold ${
                  idx === 1 || idx === 2
                    ? "border-signal-sky bg-signal-sky/10 text-signal-sky shadow-glow"
                    : idx === 0
                    ? "border-signal-mint/70 bg-signal-mint/10 text-signal-mint"
                    : "border-ink-600 bg-ink-800 text-ink-100"
                }`}
              >
                {v}
              </div>
              <span className="font-mono text-[10px] text-ink-500">{idx}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {[
          {
            title: "Step-synced code",
            body: "Every animation frame highlights the exact Java line executing right now.",
          },
          {
            title: "Scrub through time",
            body: "Play, pause, step back and forward, or drag the timeline to any point in the sort.",
          },
          {
            title: "Track your progress",
            body: "Sign in to save which algorithms you've mastered across your DSA journey.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-ink-700 bg-ink-850 p-6">
            <h3 className="font-display text-lg font-semibold text-ink-50">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-400">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
