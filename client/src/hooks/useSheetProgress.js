import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

const readLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};

/**
 * progress = { [questionId]: "pending" | "completed" | "review" }
 * Missing id means "pending".
 * Logged in  -> loaded from / saved to the database for THIS user
 *               (local copy is cached per user id for instant display).
 * Logged out -> guest progress, kept only in this browser.
 */
export default function useSheetProgress() {
  const { user } = useAuth();
  const uid = user?._id || user?.id || user?.email || null;
  const lsKey = uid ? `dsaSheetProgress:${uid}` : "dsaSheetProgress:guest";

  const [progress, setProgress] = useState(() => readLocal(lsKey));

  useEffect(() => {
    setProgress(readLocal(lsKey)); // switch instantly when the user changes
    if (!uid) return undefined;

    let cancelled = false;
    api
      .get("/sheet/progress")
      .then((res) => {
        if (cancelled) return;
        setProgress(res.data);
        localStorage.setItem(lsKey, JSON.stringify(res.data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [uid, lsKey]);

  const setStatus = useCallback(
    (questionId, status) => {
      setProgress((prev) => {
        const next = { ...prev, [questionId]: status };
        localStorage.setItem(lsKey, JSON.stringify(next));
        return next;
      });
      if (uid) api.post("/sheet/progress", { questionId, status }).catch(() => {});
    },
    [uid, lsKey]
  );

  return { progress, setStatus, loggedIn: !!uid };
}