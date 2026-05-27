import { useEffect, useMemo, useState } from "react";
import { UserTable } from "../components/UserTable";
import { AdminTable } from "../components/AdminTable";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, authLoading, apiBase } = useAuth();
  const [view, setView] = useState("user");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState(null);
  const [askResult, setAskResult] = useState(null);

  const stats = useMemo(() => {
    const admins = users.filter((item) => item.role === "admin").length;
    return {
      total: users.length,
      admins,
      members: Math.max(users.length - admins, 0),
    };
  }, [users]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const res = await fetch(`${apiBase}/users`, {
        credentials: "include",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || body.error || "Failed to fetch users");
      }

      const response = await res.json();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setUsersError(err.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const askAi = async (e) => {
    e.preventDefault();

    const q = String(question || "").trim();
    if (!q) return;

    setAskLoading(true);
    setAskError(null);
    setAskResult(null);

    try {
      const res = await fetch(`${apiBase}/users/ask`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, topK: 5 }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.message || body.error || body.details || "Failed to ask AI",
        );
      }

      const data = await res.json();
      setAskResult(data?.data || null);
    } catch (err) {
      setAskError(err.message || "Failed to ask AI");
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full bg-zinc-950 bg-cover bg-center bg-fixed text-zinc-50"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(2, 6, 23, 0.86), rgba(2, 6, 23, 0.38), rgba(2, 6, 23, 0.12)), url('/home-background.png')",
        backgroundPosition: "center top",
      }}
    >
      <div className="ml-0 mr-auto flex w-full max-w-[620px] flex-col gap-2.5 px-3 pb-5 pt-[12vh] sm:px-5 lg:pt-[8vh]">
        <section className="grid gap-2.5">
          <div className="rounded-lg border border-cyan-300/20 bg-slate-950/56 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-orange-300">
                  Generation Thailand
                </p>
                <h1 className="mt-1 text-xl font-extrabold tracking-normal text-white md:text-2xl">
                  React Assessment
                </h1>
              </div>

              <div className="flex rounded-md border border-cyan-300/20 bg-slate-900/70 p-1">
                <button
                  type="button"
                  onClick={() => setView("user")}
                  className={`min-w-24 rounded px-3 py-1.5 text-xs font-bold transition ${
                    view === "user"
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-slate-200 hover:bg-cyan-300/10"
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setView("admin")}
                  className={`min-w-24 rounded px-3 py-1.5 text-xs font-bold transition ${
                    view === "admin"
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-slate-200 hover:bg-cyan-300/10"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-md border border-cyan-300/15 bg-cyan-950/25 p-2.5">
                <div className="text-xs font-semibold text-slate-400">
                  Total users
                </div>
                <div className="mt-1 text-2xl font-extrabold text-white">
                  {usersLoading ? "-" : stats.total}
                </div>
              </div>
              <div className="rounded-md border border-orange-300/15 bg-orange-950/20 p-2.5">
                <div className="text-xs font-semibold text-slate-400">
                  Admins
                </div>
                <div className="mt-1 text-2xl font-extrabold text-white">
                  {usersLoading ? "-" : stats.admins}
                </div>
              </div>
              <div className="rounded-md border border-cyan-300/15 bg-cyan-950/25 p-2.5">
                <div className="text-xs font-semibold text-slate-400">
                  Members
                </div>
                <div className="mt-1 text-2xl font-extrabold text-white">
                  {usersLoading ? "-" : stats.members}
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-lg border border-cyan-300/20 bg-slate-950/56 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-extrabold">Ask AI</h2>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  user ? "bg-cyan-400/15 text-cyan-100" : "bg-orange-400/15 text-orange-100"
                }`}
              >
                {authLoading ? "Checking" : user ? "Active" : "Locked"}
              </span>
            </div>

            {authLoading ? (
              <div className="mt-3 rounded-md bg-slate-900/70 p-3 text-xs font-semibold text-slate-300">
                Checking login...
              </div>
            ) : user ? (
              <form onSubmit={askAi} className="mt-3 flex flex-col gap-2">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder='e.g. "Who are the admins?"'
                  className="h-9 w-full rounded-md border border-cyan-300/25 bg-slate-950/90 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  type="submit"
                  disabled={askLoading}
                  className="h-9 rounded-md bg-cyan-500 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:bg-cyan-900 disabled:text-slate-400"
                >
                  {askLoading ? "Asking..." : "Ask"}
                </button>
              </form>
            ) : (
              <div className="mt-3 rounded-md border border-orange-300/30 bg-orange-400/10 p-3 text-xs font-bold text-orange-100">
                Login required
              </div>
            )}

            {askError ? (
              <div className="mt-3 rounded-md border border-orange-300/30 bg-orange-400/10 p-2.5 text-xs font-semibold text-orange-100">
                {askError}
              </div>
            ) : null}

            {askResult ? (
              <div className="mt-3 rounded-md border border-cyan-300/15 bg-slate-900/70 p-3 text-xs">
                <div className="font-extrabold">Answer</div>
                <div className="mt-2 whitespace-pre-wrap text-zinc-300">
                  {askResult.answer || "(no answer)"}
                </div>

                <div className="mt-4 font-extrabold">Sources</div>
                {Array.isArray(askResult.sources) && askResult.sources.length ? (
                  <ul className="mt-2 space-y-2">
                    {askResult.sources.map((source) => (
                      <li
                        key={source._id}
                        className="rounded-md border border-cyan-300/10 bg-slate-950/70 px-3 py-2 text-slate-200"
                      >
                        {source.username} ({source.role}) - {source.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2 text-zinc-300">No sources found.</div>
                )}
              </div>
            ) : null}
          </section>
        </section>

        <section className="rounded-lg border border-cyan-300/20 bg-slate-950/60 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-extrabold">
                {view === "user" ? "User Directory" : "Admin Console"}
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                {usersLoading
                  ? "Loading users..."
                  : `${stats.total} records loaded`}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchUsers}
              disabled={usersLoading}
              className="h-8 rounded-md border border-cyan-300/20 bg-slate-900/70 px-3 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/10 disabled:text-slate-500"
            >
              Refresh
            </button>
          </div>

          {usersError ? (
            <div className="mb-3 rounded-md border border-orange-300/30 bg-orange-400/10 p-2.5 text-xs font-semibold text-orange-100">
              {usersError}
            </div>
          ) : null}

          {view === "user" ? (
            <div className="max-h-[300px] overflow-auto">
              <UserTable users={users} />
            </div>
          ) : authLoading ? (
            <div className="rounded-md bg-slate-900/70 p-6 text-center text-sm font-bold text-slate-300">
              Checking login...
            </div>
          ) : user ? (
            <div className="max-h-[340px] overflow-auto">
              <AdminTable
                users={users}
                setUsers={setUsers}
                fetchUsers={fetchUsers}
                API={`${apiBase}/users`}
              />
            </div>
          ) : (
            <div className="rounded-md border border-orange-300/30 bg-orange-400/10 p-6 text-center text-sm font-bold text-orange-100">
              Login required
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
