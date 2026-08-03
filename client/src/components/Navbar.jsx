import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-signal-purple" : "text-ink-300 hover:text-ink-50"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-purple font-display text-sm font-bold text-ink-950">
            {"</>"}
          </span>
          <span className="font-display text-lg font-semibold text-ink-50">DSAtrail</span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/topics" className={linkClass}>
            Topics
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden font-mono text-xs text-ink-400 sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-lg border border-ink-600 px-3 py-1.5 text-sm text-ink-200 transition hover:border-signal-coral hover:text-signal-coral"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm text-ink-200 transition hover:text-ink-50"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-signal-purple px-3.5 py-1.5 text-sm font-medium text-ink-950 transition hover:brightness-110"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
