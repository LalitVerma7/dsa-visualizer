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

  return (
    <AuthContext.Provider value={{ user, loading, authError, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
