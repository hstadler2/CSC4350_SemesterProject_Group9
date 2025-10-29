import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../utils/api";

export default function Prescriptions() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", dosage: "", instructions: "" });
  const [list, setList] = useState(api.listPrescriptions(user.id));

  const add = (e) => {
    e.preventDefault();
    const created = api.addPrescription({ ...form, userId: user.id });
    setList((l) => [created, ...l]);
    setForm({ name: "", dosage: "", instructions: "" });
  };

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-bold">Prescriptions</h1>
      <form onSubmit={add} className="grid md:grid-cols-3 gap-3 border bg-white p-4 rounded-2xl">
        <Input label="Medication" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
        <Input label="Dosage" value={form.dosage} onChange={(v) => setForm((f) => ({ ...f, dosage: v }))} />
        <label className="grid gap-1 md:col-span-3">
          <span className="text-sm">Instructions</span>
          <textarea className="input" value={form.instructions} onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))} />
        </label>
        <div className="md:col-span-3">
          <button className="btn-primary">Add</button>
        </div>
      </form>

      <div className="border bg-white rounded-2xl">
        <div className="p-4 border-b font-semibold">Active</div>
        <ul className="divide-y">
          {list.map((p) => (
            <li key={p.id} className="p-4 grid md:grid-cols-3 gap-2 text-sm">
              <span className="font-medium">{p.name}</span>
              <span>{p.dosage}</span>
              <span className="truncate">{p.instructions}</span>
            </li>
          ))}
          {list.length === 0 && <li className="p-4 text-sm text-gray-500">No prescriptions yet.</li>}
        </ul>
      </div>
    </section>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm">{label}</span>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
