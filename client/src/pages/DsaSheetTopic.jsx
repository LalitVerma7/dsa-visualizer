import { Link, useParams } from "react-router-dom";
import { LEVELS, getTopic, questionsFor } from "../data/dsaSheet";
import useSheetProgress from "../hooks/useSheetProgress";

const levelColor = {
  easy: "text-emerald-400 border-emerald-500/40 hover:border-emerald-400",
  medium: "text-amber-400 border-amber-500/40 hover:border-amber-400",
  hard: "text-rose-400 border-rose-500/40 hover:border-rose-400",
};

export default function DsaSheetTopic() {
  const { topic: slug } = useParams();
  const topic = getTopic(slug);
  const { progress } = useSheetProgress();

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p>Topic not found.</p>
        <Link to="/dsa-sheet" className="text-indigo-400 underline">Back to DSA Sheet</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/dsa-sheet" className="text-sm text-indigo-400 hover:underline">← DSA Sheet</Link>
      <h1 className="text-3xl font-bold mt-2 mb-8">{topic.name}</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {LEVELS.map((level) => {
          const qs = questionsFor(topic, level);
          const done = qs.filter((q) => progress[q.id] === "completed").length;
          return (
            <Link
              key={level}
              to={`/dsa-sheet/${topic.slug}/${level}`}
              className={`rounded-xl border bg-slate-800/60 p-6 text-center transition ${levelColor[level]}`}
            >
              <h2 className="text-xl font-semibold capitalize">{level}</h2>
              <p className="text-sm text-slate-400 mt-2">
                {done}/{qs.length} completed
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
