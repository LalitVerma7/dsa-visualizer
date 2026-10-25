import { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS, SHEET_TOPICS } from "../data/dsaSheet";
import useSheetProgress from "../hooks/useSheetProgress";

const ALL = SHEET_TOPICS.flatMap((t) => t.questions);

const levelText = {
  easy: "text-signal-mint",
  medium: "text-signal-sky",
  hard: "text-signal-coral",
};

function Stat({ label, value, to, className = "" }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 transition hover:border-signal-purple"
    >
      <p className={`font-display text-2xl font-semibold ${className}`}>{value}</p>
      <p className="text-xs text-ink-400">{label} →</p>
    </Link>
  );
}

function ProgressReport({ progress, loggedIn, onReset }) {
  const [confirming, setConfirming] = useState(false);
  const total = ALL.length;
  const count = (s) => ALL.filter((q) => progress[q.id] === s).length;
  const completed = count("completed");
  const review = count("review");
  const pending = total - completed - review;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="mb-10 rounded-2xl border border-ink-700 bg-ink-850 p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-50">Your progress</h2>
          <p className="text-sm text-ink-400">
            {completed} of {total} questions completed
          </p>
        </div>
        <span className="font-display text-4xl font-semibold text-signal-purple">{pct}%</span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full bg-signal-mint transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Completed" value={completed} to="/dsa-sheet/status/completed" className="text-signal-mint" />
        <Stat label="Review" value={review} to="/dsa-sheet/status/review" className="text-signal-sky" />
        <Stat label="Pending" value={pending} to="/dsa-sheet/status/pending" className="text-ink-200" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {LEVELS.map((lv) => {
          const qs = ALL.filter((q) => q.level === lv);
          const d = qs.filter((q) => progress[q.id] === "completed").length;
          const p = qs.length ? Math.round((d / qs.length) * 100) : 0;
          return (
            <div key={lv} className="rounded-xl border border-ink-700 bg-ink-900 px-4 py-3">
              <div className="flex justify-between text-sm">
                <span className={`font-medium capitalize ${levelText[lv]}`}>{lv}</span>
                <span className="text-ink-400">
                  {d}/{qs.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-ink-700">
                <div className="h-full bg-signal-purple" style={{ width: `${p}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {completed + review > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-ink-700 pt-4">
          {confirming ? (
            <>
              <span className="text-sm text-ink-300">
                Reset all progress? This can&apos;t be undone.
              </span>
              <button
                onClick={() => {
                  onReset();
                  setConfirming(false);
                }}
                className="rounded-lg bg-signal-coral px-3 py-1.5 text-sm font-medium text-ink-950 transition hover:brightness-110"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-ink-600 px-3 py-1.5 text-sm text-ink-200 transition hover:text-ink-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-sm text-ink-200 transition hover:border-signal-coral hover:text-signal-coral"
            >
              Reset progress
            </button>
          )}
        </div>
      )}

      {!loggedIn && (
        <p className="mt-5 text-sm text-ink-400">
          <Link to="/login" className="text-signal-purple hover:underline">
            Log in
          </Link>{" "}
          to save your progress to your account.
        </p>
      )}
    </section>
  );
}

export default function DsaSheet() {
  const { progress, loggedIn, resetProgress } = useSheetProgress();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-50">DSA Sheet</h1>
      <p className="mb-8 mt-1 text-ink-400">Pick a topic to start practising.</p>

      <ProgressReport progress={progress} loggedIn={loggedIn} onReset={resetProgress} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SHEET_TOPICS.map((topic) => {
          const total = topic.questions.length;
          const done = topic.questions.filter((q) => progress[q.id] === "completed").length;
          const pct = total ? Math.round((done / total) * 100) : 0;

          return (
            <Link
              key={topic.slug}
              to={`/dsa-sheet/${topic.slug}`}
              className="rounded-2xl border border-ink-700 bg-ink-850 p-5 transition hover:border-signal-purple"
            >
              <h2 className="font-display text-lg font-semibold text-ink-50">{topic.name}</h2>
              <p className="mb-4 mt-1 text-sm text-ink-400">{topic.description}</p>
              <div className="h-2 overflow-hidden rounded bg-ink-700">
                <div className="h-full bg-signal-mint" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink-400">
                {done}/{total} completed
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
