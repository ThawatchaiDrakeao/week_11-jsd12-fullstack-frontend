export function UserTable({ users }) {
  if (!users.length) {
    return (
      <div className="rounded-md border border-dashed border-cyan-300/25 bg-slate-950/50 p-6 text-center text-xs font-semibold text-slate-300">
        No users found
      </div>
    );
  }

  return (
    <table className="w-full min-w-[540px] border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-cyan-300/20 bg-cyan-950/30 text-xs uppercase tracking-normal text-cyan-100">
          <th className="px-3 py-2.5 font-extrabold">Username</th>
          <th className="px-3 py-2.5 font-extrabold">Email</th>
          <th className="px-3 py-2.5 font-extrabold">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="border-b border-cyan-300/10 bg-slate-950/45">
            <td className="px-3 py-2.5 font-bold text-slate-100">
              {user.username}
            </td>
            <td className="px-3 py-2.5 text-slate-300">{user.email}</td>
            <td className="px-3 py-2.5">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                  user.role === "admin"
                    ? "bg-orange-400/20 text-orange-100"
                    : "bg-cyan-400/15 text-cyan-100"
                }`}
              >
                {user.role}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
