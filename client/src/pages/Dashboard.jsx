import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { ALGORITHMS } from "../algorithms/registry.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/progress")
      .then((res) => setProgress(res.data.progress))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const implemented = ALGORITHMS.filter((a) => a.implemented);
  const completedCount = progress.filter((p) => p.completed).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-50">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="mt-2 text-ink-400">
        {completedCount} of {implemented.length} available algorithms completed.
      </p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-800">
        <div
          className="h-full rounded-full bg-signal-purple transition-all"
          style={{ width: `${implemented.length ? (completedCount / implemented.length) * 100 : 0}%` }}
        />
      </div>

      <div className="mt-10 space-y-3">
        {loading && <p className="text-sm text-ink-500">Loading your progress...</p>}

        {!loading &&
          implemented.map((algo) => {
            const record = progress.find((p) => p.algorithmSlug === algo.slug);
            return (
              <Link
                key={algo.slug}
                to={`/topics/${algo.category}/${algo.slug}`}
                className="flex items-center justify-between rounded-xl border border-ink-700 bg-ink-850 px-5 py-4 transition hover:border-signal-purple"
              >
                <div>
                  <p className="font-display font-semibold text-ink-100">{algo.name}</p>
                  <p className="text-xs text-ink-500">
                    {record ? `Run ${record.timesRun} time${record.timesRun === 1 ? "" : "s"}` : "Not started yet"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    record?.completed
                      ? "bg-signal-mint/15 text-signal-mint"
                      : "bg-ink-700 text-ink-400"
                  }`}
                >
                  {record?.completed ? "Completed" : "Not completed"}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
