import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, authLoading, authError, login, logout, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const pasteIntoField = (e, value, setValue, maxLength) => {
    const pastedText = e.clipboardData.getData("text");
    if (!pastedText) return;

    e.preventDefault();

    const input = e.currentTarget;
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const nextValue = `${value.slice(0, start)}${pastedText}${value.slice(end)}`;

    setValue(maxLength ? nextValue.slice(0, maxLength) : nextValue);
  };

  const switchMode = (next) => {
    setMode(next);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok =
      mode === "login"
        ? await login({ email, password })
        : await register({ username, email, password });
    setSubmitting(false);
    if (ok) resetForm();
  };

  const fillDemoLogin = () => {
    setMode("login");
    setEmail("crystal.lake.slash@example.com");
    setPassword("Friday13th_Killer");
  };

  return (
    <nav>
      <div className="flex min-h-12 w-full flex-col gap-2 border-b border-cyan-300/20 bg-slate-950/88 px-4 py-2 text-slate-100 shadow-lg shadow-black/30 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <ul className="flex items-center gap-x-5 text-xl font-semibold">
          <li>
            <Link to="/" className="transition hover:text-orange-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/owner" className="transition hover:text-orange-300">
              Owner
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-x-3">
          {authLoading ? (
            <span className="text-sm text-cyan-100">Checking session...</span>
          ) : user ? (
            <>
              <span className="text-sm text-slate-200">
                Logged in as <span className="font-bold">{user.username}</span>
              </span>
              <button
                onClick={logout}
                className="h-8 cursor-pointer rounded-md bg-orange-500 px-3 text-sm font-bold text-slate-950 transition hover:bg-orange-400"
              >
                Logout
              </button>
            </>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative z-10 flex w-full flex-wrap items-center gap-2 lg:w-auto"
            >
              {mode === "signup" && (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onPaste={(e) => pasteIntoField(e, username, setUsername, 20)}
                  placeholder="username"
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="h-8 w-28 rounded-md border border-cyan-300/20 bg-slate-900 px-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300"
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                />
              )}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onPaste={(e) => pasteIntoField(e, email, setEmail)}
                placeholder="email"
                name="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="h-10 min-w-0 flex-1 rounded-md border border-cyan-300/30 bg-slate-900 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300 sm:w-80 sm:flex-none"
                type="email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPaste={(e) => pasteIntoField(e, password, setPassword, 72)}
                placeholder="password"
                type="password"
                name="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="h-10 min-w-0 flex-1 rounded-md border border-cyan-300/30 bg-slate-900 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300 sm:w-48 sm:flex-none"
                required
                minLength={8}
                maxLength={72}
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-10 cursor-pointer rounded-md bg-cyan-500 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:bg-cyan-900 disabled:text-slate-400"
              >
                {mode === "login" ? "Login" : "Sign up"}
              </button>
              {mode === "login" ? (
                <button
                  type="button"
                  onClick={fillDemoLogin}
                  className="h-10 cursor-pointer rounded-md border border-cyan-300/25 bg-slate-900 px-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/10"
                >
                  Demo
                </button>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  switchMode(mode === "login" ? "signup" : "login")
                }
                className="cursor-pointer text-sm text-orange-200 underline transition hover:text-orange-100"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </form>
          )}
        </div>
      </div>

      {authError ? (
        <div className="border-b border-rose-300/30 bg-rose-950/90 px-10 py-2 text-sm font-semibold text-rose-100">
          {authError}
        </div>
      ) : null}
    </nav>
  );
}
