import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("dsav_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("dsav_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setAuthError("");
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      localStorage.setItem("dsav_token", res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || "Signup failed. Please try again.");
      return false;
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setAuthError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("dsav_token", res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || "Login failed. Please try again.");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dsav_token");
    setUser(null);
  }, []);

  const WEEK = 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (!user) return undefined;

    // Logged in again after a long break? Log out.
    const last = Number(localStorage.getItem("lastActive") || 0);
    if (last && Date.now() - last > WEEK) {
      logout();
      return undefined;
    }

    // Record activity at most once a minute.
    let t = 0;
    const mark = () => {
      const now = Date.now();
      if (now - t > 60000) {
        t = now;
        localStorage.setItem("lastActive", String(now));
      }
    };
    mark();
    const events = ["click", "keydown", "scroll", "mousemove"];
    events.forEach((e) => window.addEventListener(e, mark));
    return () => events.forEach((e) => window.removeEventListener(e, mark));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, authError, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
