import { Link, useParams } from "react-router-dom";
import { LEVELS, STATUSES, getTopic, questionsFor } from "../data/dsaSheet";
import useSheetProgress from "../hooks/useSheetProgress";

const statusStyle = {
  pending: "bg-slate-700 text-slate-200",
  completed: "bg-emerald-600 text-white",
  review: "bg-amber-500 text-black",
};

export default function DsaSheetQuestions() {
  const { topic: slug, level } = useParams();
  const topic = getTopic(slug);
  const { progress, setStatus } = useSheetProgress();

  if (!topic || !LEVELS.includes(level)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p>Not found.</p>
        <Link to="/dsa-sheet" className="text-indigo-400 underline">Back to DSA Sheet</Link>
      </div>
    );
  }

  const questions = questionsFor(topic, level);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to={`/dsa-sheet/${topic.slug}`} className="text-sm text-indigo-400 hover:underline">
        ← {topic.name}
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-8">
        {topic.name} · <span className="capitalize">{level}</span>
      </h1>

      {questions.length === 0 ? (
        <p className="text-slate-400">No questions added yet.</p>
      ) : (
        <ul className="divide-y divide-slate-700 rounded-xl border border-slate-700 bg-slate-800/60">
          {questions.map((q, i) => {
            const status = progress[q.id] || "pending";
            return (
              <li key={q.id} className="flex items-center gap-4 px-4 py-3">
                <span className="w-6 text-sm text-slate-500">{i + 1}</span>
                <a
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 hover:text-indigo-400 hover:underline"
                >
                  {q.title}
                </a>
                <select
                  value={status}
                  onChange={(e) => setStatus(q.id, e.target.value)}
                  className={`rounded px-2 py-1 text-sm capitalize cursor-pointer ${statusStyle[status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-slate-800 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
