import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../utils/api";

export default function Appointment() {
  const { user } = useAuth();
  const [form, setForm] = useState({ date: "", reason: "", notes: "" });
  const [list, setList] = useState(api.listAppointments(user.id));

  const submit = (e) => {
    e.preventDefault();
    const created = api.createAppointment({ ...form, userId: user.id, status: "Requested" });
    setList((l) => [created, ...l]);
    setForm({ date: "", reason: "", notes: "" });
  };

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-bold">Appointments</h1>
      <form onSubmit={submit} className="grid md:grid-cols-3 gap-3 border bg-white p-4 rounded-2xl">
        <label className="grid gap-1">
          <span className="text-sm">Date & time</span>
          <input type="datetime-local" className="input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Reason</span>
          <input className="input" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
        </label>
        <label className="grid gap-1 md:col-span-3">
          <span className="text-sm">Notes (optional)</span>
          <textarea className="input min-h-[80px]" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </label>
        <div className="md:col-span-3">
          <button className="btn-primary">Request appointment</button>
        </div>
      </form>

      <div className="border bg-white rounded-2xl">
        <div className="p-4 border-b font-semibold">Your requests</div>
        <ul className="divide-y">
          {list.map((a) => (
            <li key={a.id} className="p-4 grid md:grid-cols-4 text-sm gap-2">
              <span>{new Date(a.date).toLocaleString()}</span>
              <span className="truncate">{a.reason}</span>
              <span className="truncate">{a.notes || "—"}</span>
              <span className="justify-self-end">{a.status}</span>
            </li>
          ))}
          {list.length === 0 && <li className="p-4 text-sm text-gray-500">No appointments yet.</li>}
        </ul>
      </div>
    </section>
  );
}