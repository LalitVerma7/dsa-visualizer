import { Link, useParams } from "react-router-dom";
import { SHEET_TOPICS, STATUSES } from "../data/dsaSheet";
import useSheetProgress from "../hooks/useSheetProgress";

const ALL = SHEET_TOPICS.flatMap((t) => t.questions.map((q) => ({ ...q, topic: t })));

const TITLES = { completed: "Completed", review: "Review", pending: "Pending" };

const selectStyle = {
  pending: "bg-ink-700 text-ink-100",
  completed: "bg-signal-mint text-ink-950",
  review: "bg-signal-sky text-ink-950",
};

const levelText = {
  easy: "text-signal-mint",
  medium: "text-signal-sky",
  hard: "text-signal-coral",
};

export default function DsaSheetStatus() {
  const { status } = useParams();
  const { progress, setStatus } = useSheetProgress();

  if (!STATUSES.includes(status)) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-ink-100">Not found.</p>
        <Link to="/dsa-sheet" className="text-signal-purple underline">
          Back to DSA Sheet
        </Link>
      </div>
    );
  }

  const statusOf = (q) => progress[q.id] || "pending";
  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, ALL.filter((q) => statusOf(q) === s).length])
  );
  const list = ALL.filter((q) => statusOf(q) === status);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/dsa-sheet" className="text-sm text-signal-purple hover:underline">
        ← DSA Sheet
      </Link>
      <h1 className="mb-6 mt-2 font-display text-3xl font-semibold text-ink-50">
        {TITLES[status]} questions
      </h1>

      <div className="mb-6 flex gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            to={`/dsa-sheet/status/${s}`}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              s === status
                ? "border-signal-purple text-signal-purple"
                : "border-ink-700 text-ink-300 hover:text-ink-50"
            }`}
          >
            {TITLES[s]} ({counts[s]})
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-ink-400">No {status} questions yet.</p>
      ) : (
        <ul className="divide-y divide-ink-700 rounded-2xl border border-ink-700 bg-ink-850">
          {list.map((q, i) => (
            <li key={q.id} className="flex items-center gap-4 px-4 py-3">
              <span className="w-8 text-sm text-ink-500">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <a
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-100 hover:text-signal-purple hover:underline"
                >
                  {q.title}
                </a>
                <p className="text-xs text-ink-400">
                  {q.topic.name} ·{" "}
                  <span className={`capitalize ${levelText[q.level]}`}>{q.level}</span>
                </p>
              </div>
              <select
                value={statusOf(q)}
                onChange={(e) => setStatus(q.id, e.target.value)}
                className={`cursor-pointer rounded px-2 py-1 text-sm capitalize ${selectStyle[statusOf(q)]}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-ink-800 text-ink-50">
                    {s}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
