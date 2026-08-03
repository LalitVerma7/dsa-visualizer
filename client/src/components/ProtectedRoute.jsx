import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="font-mono text-sm text-ink-500">Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
