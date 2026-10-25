import { Link } from "react-router-dom";
import HeroVisualizer from "../components/HeroVisualizer.jsx";
import ParticleField from "../components/ParticleField.jsx";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-signal-purple/20 blur-[140px]" />
      <ParticleField />

      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
        <span className="animate-float mb-6 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-850 px-4 py-1.5 font-mono text-xs text-signal-purple">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-mint opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-mint" />
          </span>
          Data Structures &amp; Algorithms, visualized
        </span>

        <h1 className="font-display text-4xl font-semibold leading-[1.08] text-ink-50 sm:text-6xl">
          Watch algorithms
          <br />
          <span className="bg-gradient-to-r from-signal-purple to-signal-sky bg-clip-text text-transparent">
            think, compare, and learn.
          </span>
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
          <Link
            to="/dsa-sheet"
            className="rounded-xl border border-ink-700 bg-ink-850 px-7 py-3.5 font-display text-base font-semibold text-ink-50 transition hover:border-signal-purple hover:text-signal-purple"
          >
            DSA Sheet
          </Link>
        </div>

        {/* live bubble-sort animation (loops forever) */}
        <HeroVisualizer />
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
          <div
            key={f.title}
            className="rounded-2xl border border-ink-700 bg-ink-850 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-signal-purple/40"
          >
            <h3 className="font-display text-lg font-semibold text-ink-50">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-400">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
