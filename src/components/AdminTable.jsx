import { useState } from "react";

export function AdminTable({ users, setUsers, fetchUsers, API }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const res = await fetch(API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || body.error || "Failed to create user");
      }
      await fetchUsers();
      setForm({ username: "", email: "", role: "", password: "" });
    } catch (error) {
      setFormError(error.message || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return;
    setUsers(users.filter((user) => user._id !== id));
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditSave = async (id) => {
    setFormError(null);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || body.error || "Failed to update user");
      }
      await fetchUsers();
      setEditId(null);
    } catch (error) {
      setFormError(error.message || "Failed to update user");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  return (
    <div className="flex min-w-[760px] flex-col">
      {formError && (
        <div className="mb-2.5 w-full rounded-md border border-orange-300/30 bg-orange-400/10 px-3 py-2.5 text-xs font-semibold text-orange-100">
          {formError}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mb-3 grid grid-cols-[1fr_1.4fr_0.8fr_1fr_auto] gap-2"
      >
        <input
          onChange={handleChange}
          value={form.username}
          name="username"
          className="h-8 rounded-md border border-cyan-300/20 bg-slate-950/80 px-2.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Username"
          required
          minLength={3}
          maxLength={20}
        />
        <input
          onChange={handleChange}
          value={form.email}
          name="email"
          className="h-8 rounded-md border border-cyan-300/20 bg-slate-950/80 px-2.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Email"
          type="email"
          required
        />
        <select
          onChange={handleChange}
          value={form.role}
          name="role"
          className="h-8 rounded-md border border-cyan-300/20 bg-slate-950/80 px-2.5 text-xs text-slate-100 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
        >
          <option value="">Select role</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <input
          onChange={handleChange}
          value={form.password}
          name="password"
          className="h-8 rounded-md border border-cyan-300/20 bg-slate-950/80 px-2.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Password"
          type="password"
          required
          minLength={8}
          maxLength={72}
        />
        <button
          type="submit"
          className="h-8 cursor-pointer rounded-md bg-cyan-500 px-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Save
        </button>
      </form>
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-cyan-300/20 bg-cyan-950/30 text-xs uppercase tracking-normal text-cyan-100">
            <th className="px-3 py-2.5 font-extrabold">Username</th>
            <th className="px-3 py-2.5 font-extrabold">Email</th>
            <th className="px-3 py-2.5 font-extrabold">Role</th>
            <th className="px-3 py-2.5 text-right font-extrabold">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-cyan-300/10 bg-slate-950/45">
              {editId === user._id ? (
                <>
                  <td className="px-3 py-2.5">
                    <input
                      value={editForm.username}
                      onChange={handleEditChange}
                      name="username"
                      className="h-8 w-full rounded-md border border-cyan-300/20 bg-slate-950/80 px-2.5 text-xs text-slate-100 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                      required
                      minLength={3}
                      maxLength={20}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      value={editForm.email}
                      onChange={handleEditChange}
                      name="email"
                      className="h-8 w-full rounded-md border border-cyan-300/20 bg-slate-950/80 px-2.5 text-xs text-slate-100 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                      type="email"
                      required
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <select
                      value={editForm.role}
                      onChange={handleEditChange}
                      name="role"
                      className="h-8 w-full rounded-md border border-cyan-300/20 bg-slate-950/80 px-2.5 text-xs text-slate-100 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      <option value="">Select role</option>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => handleEditSave(user._id)}
                      className="mr-1.5 h-7 cursor-pointer rounded-md bg-cyan-500 px-2.5 text-[11px] font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="h-7 cursor-pointer rounded-md border border-cyan-300/20 bg-slate-900/80 px-2.5 text-[11px] font-bold text-slate-200 transition hover:bg-cyan-300/10"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
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
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => handleEdit(user)}
                      className="mr-1.5 h-7 cursor-pointer rounded-md border border-cyan-300/20 bg-slate-900/80 px-2.5 text-[11px] font-bold text-slate-200 transition hover:bg-cyan-300/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="h-7 cursor-pointer rounded-md bg-orange-600 px-2.5 text-[11px] font-bold text-white transition hover:bg-orange-500"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
