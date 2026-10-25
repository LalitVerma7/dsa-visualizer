import { Link } from "react-router-dom";
import { CATEGORIES, getAlgorithmsByCategory } from "../algorithms/registry.js";

export default function Topics() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-signal-purple">Choose a topic</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink-50 sm:text-4xl">
          Where do you want to start?
        </h1>
        <p className="mt-3 max-w-2xl text-ink-400">
          Pick a category, then an algorithm. Bubble Sort is fully interactive today &mdash; more
          algorithms are on the way and will unlock right here.
        </p>
      </div>

      <div className="space-y-10">
        {CATEGORIES.map((cat) => {
          const algos = getAlgorithmsByCategory(cat.id);
          if (algos.length === 0) return null;

          return (
            <div key={cat.id}>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-display text-xl font-semibold text-ink-100">{cat.name}</h2>
                <span className="text-xs text-ink-500">{cat.tagline}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {algos.map((algo) =>
                  algo.implemented ? (
                    <Link
                      key={algo.slug}
                      to={`/topics/${algo.category}/${algo.slug}`}
                      className="group rounded-2xl border border-ink-700 bg-ink-850 p-5 transition hover:border-signal-purple hover:shadow-glow"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-semibold text-ink-50">{algo.name}</h3>
                        <span className="rounded-full bg-signal-mint/15 px-2 py-0.5 text-[10px] font-medium text-signal-mint">
                          {algo.difficulty}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-ink-400">{algo.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-signal-purple opacity-0 transition group-hover:opacity-100">
                        Visualize it &rarr;
                      </span>
                    </Link>
                  ) : (
                    <div
                      key={algo.slug}
                      className="rounded-2xl border border-dashed border-ink-700 bg-ink-900/50 p-5 opacity-60"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-semibold text-ink-300">{algo.name}</h3>
                        <span className="rounded-full bg-ink-700 px-2 py-0.5 text-[10px] font-medium text-ink-400">
                          {algo.difficulty}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-ink-500">Coming soon</p>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
