import { Link } from "react-router-dom";
import { SHEET_TOPICS } from "../data/dsaSheet";
import useSheetProgress from "../hooks/useSheetProgress";

export default function DsaSheet() {
  const { progress } = useSheetProgress();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">DSA Sheet</h1>
      <p className="text-slate-400 mb-8">Pick a topic to start practising.</p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SHEET_TOPICS.map((topic) => {
          const total = topic.questions.length;
          const done = topic.questions.filter((q) => progress[q.id] === "completed").length;
          const pct = total ? Math.round((done / total) * 100) : 0;

          return (
            <Link
              key={topic.slug}
              to={`/dsa-sheet/${topic.slug}`}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-5 hover:border-indigo-400 transition"
            >
              <h2 className="text-xl font-semibold">{topic.name}</h2>
              <p className="text-sm text-slate-400 mt-1 mb-4">{topic.description}</p>
              <div className="h-2 rounded bg-slate-700 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {done}/{total} completed
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
