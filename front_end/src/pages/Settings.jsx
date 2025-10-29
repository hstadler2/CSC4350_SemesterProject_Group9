import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const save = (e) => {
    e.preventDefault();
    const updated = { ...user, name, email };
    localStorage.setItem("campuscare_auth_v1", JSON.stringify(updated));
    alert("Saved (demo)");
  };

  return (
    <section className="grid gap-6 max-w-lg">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form onSubmit={save} className="grid gap-3 border bg-white p-4 rounded-2xl">
        <label className="grid gap-1">
          <span className="text-sm">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <div className="flex gap-2">
          <button className="btn-primary">Save</button>
          <button type="button" onClick={logout} className="px-3 py-2 border rounded">Logout</button>
        </div>
      </form>
    </section>
  );
}