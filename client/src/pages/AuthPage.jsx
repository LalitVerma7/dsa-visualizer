import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./AuthPage.css";

const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  user: (
    <svg {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  mail: (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  lock: (
    <svg {...svgProps}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  eye: (
    <svg {...svgProps}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg {...svgProps}>
      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a17.5 17.5 0 0 1 4.1-4.9M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.2 3.2" />
      <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <path d="m3 3 18 18" />
    </svg>
  ),
};

function Field({ type, label, value, onChange, icon, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="field-wrapper slide-element">
      <input
        type={isPassword && show ? "text" : type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
      <label>{label}</label>
      {isPassword ? (
        <button
          type="button"
          className="toggle-eye"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? ICONS.eyeOff : ICONS.eye}
        </button>
      ) : (
        <i>{ICONS[icon]}</i>
      )}
    </div>
  );
}

export default function AuthPage({ mode = "login" }) {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();

  const [signupMode, setSignupMode] = useState(mode === "signup");
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(""); // which form was last submitted

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // follow the URL when the user clicks Log in / Sign up in the navbar
  useEffect(() => {
    setSignupMode(mode === "signup");
    setAttempt("");
  }, [mode]);

  if (user) return <Navigate to="/" replace />;

  // login() and signup() in AuthContext take ONE object and return true/false
  // (they never throw; the message is in auth.authError).
  const run = async (which, fn) => {
    setAttempt(which);
    setBusy(true);
    const ok = await fn();
    setBusy(false);
    if (ok) navigate("/"); // go to the Home page after login / signup
  };

  const onLogin = (e) => {
    e.preventDefault();
    run("login", () => auth.login({ email: loginEmail, password: loginPassword }));
  };

  const onSignup = (e) => {
    e.preventDefault();
    run("signup", () => auth.signup({ name, email, password }));
  };

  const switchTo = (toSignup) => (e) => {
    e.preventDefault();
    setAttempt("");
    setSignupMode(toSignup);
  };

  return (
    <div className="auth-page">
      <div className={`auth-wrapper ${signupMode ? "toggled" : ""}`}>
        <div className="background-shape" />
        <div className="secondary-shape" />

        {/* LOGIN */}
        <div className="credentials-panel signin">
          <h2 className="slide-element">Login</h2>
          <form onSubmit={onLogin}>
            <Field type="email" label="Email" icon="mail" value={loginEmail} onChange={setLoginEmail} autoComplete="email" />
            <Field type="password" label="Password" icon="lock" value={loginPassword} onChange={setLoginPassword} autoComplete="current-password" />
            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={busy}>
                {busy && !signupMode ? "Please wait…" : "Login"}
              </button>
            </div>
            <div className="switch-link slide-element">
              <p>
                Don’t have an account? <br />
                <a href="#" onClick={switchTo(true)}>Sign Up</a>
              </p>
            </div>
            {attempt === "login" && auth.authError && <p className="auth-error">{auth.authError}</p>}
          </form>
        </div>

        <div className="welcome-section signin">
          <h2 className="slide-element">Welcome back!</h2>
          <p className="slide-element">Continue your DSA journey.</p>
        </div>

        {/* REGISTER */}
        <div className="credentials-panel signup">
          <h2 className="slide-element">Register</h2>
          <form onSubmit={onSignup}>
            <Field type="text" label="Name" icon="user" value={name} onChange={setName} autoComplete="name" />
            <Field type="email" label="Email" icon="mail" value={email} onChange={setEmail} autoComplete="email" />
            <Field type="password" label="Password" icon="lock" value={password} onChange={setPassword} autoComplete="new-password" />
            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={busy}>
                {busy && signupMode ? "Please wait…" : "Register"}
              </button>
            </div>
            <div className="switch-link slide-element">
              <p>
                Already have an account? <br />
                <a href="#" onClick={switchTo(false)}>Sign In</a>
              </p>
            </div>
            {attempt === "signup" && auth.authError && <p className="auth-error">{auth.authError}</p>}
          </form>
        </div>

        <div className="welcome-section signup">
          <h2 className="slide-element">Welcome!</h2>
          <p className="slide-element">Create an account to save your progress.</p>
        </div>
      </div>
    </div>
  );
}
