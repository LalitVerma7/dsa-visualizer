import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await signup(form);
    setSubmitting(false);
    if (ok) navigate("/topics");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="font-display text-2xl font-semibold text-ink-50">Start your DSA journey</h1>
      <p className="mt-2 text-sm text-ink-400">Create an account to save your progress as you go.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-400">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-ink-600 bg-ink-800 px-3.5 py-2.5 text-sm text-ink-100 outline-none focus:border-signal-purple"
            placeholder="Lalit"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-400">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-ink-600 bg-ink-800 px-3.5 py-2.5 text-sm text-ink-100 outline-none focus:border-signal-purple"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-400">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-ink-600 bg-ink-800 px-3.5 py-2.5 text-sm text-ink-100 outline-none focus:border-signal-purple"
            placeholder="At least 6 characters"
          />
        </div>

        {authError && <p className="text-sm text-signal-coral">{authError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-signal-purple py-2.5 font-display text-sm font-semibold text-ink-950 transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-signal-purple hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
