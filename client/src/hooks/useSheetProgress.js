import { useCallback, useEffect, useState } from "react";
import api from "../api/axios"; // same axios instance the rest of the app uses

const LS_KEY = "dsaSheetProgress";

const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
};

/**
 * progress = { [questionId]: "pending" | "completed" | "review" }
 * Missing id means "pending".
 * Works offline / logged-out via localStorage; syncs to the API when it can.
 */
export default function useSheetProgress() {
  const [progress, setProgress] = useState(readLocal);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/sheet/progress")
      .then((res) => {
        if (cancelled) return;
        setProgress(res.data);
        localStorage.setItem(LS_KEY, JSON.stringify(res.data));
      })
      .catch(() => {
        /* not logged in or server down -> keep local copy */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setStatus = useCallback((questionId, status) => {
    setProgress((prev) => {
      const next = { ...prev, [questionId]: status };
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
    api.post("/sheet/progress", { questionId, status }).catch(() => {});
  }, []);

  return { progress, setStatus };
}
