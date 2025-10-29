import { useState } from "react";
import { api } from "../utils/api";

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export default function Schedule() {
  const [day, setDay] = useState(todayISO());
  const [entries, setEntries] = useState(api.getSchedule(day));
  const [form, setForm] = useState({ time: "09:00", task: "Check-in desk" });

  const add = (e) => {
    e.preventDefault();
    const next = [{ id: crypto.randomUUID(), ...form }, ...entries];
    setEntries(next);
    api.setScheduleDay(day, next);
  };

  const onDayChange = (d) => {
    setDay(d);
    setEntries(api.getSchedule(d));
  };

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-bold">Schedule</h1>
      <div className="flex items-end gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Day</span>
          <input type="date" className="input" value={day} onChange={(e) => onDayChange(e.target.value)} />
        </label>
        <form onSubmit={add} className="flex items-end gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Time</span>
            <input type="time" className="input" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Task</span>
            <input className="input" value={form.task} onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))} />
          </label>
          <button className="btn-primary">Add</button>
        </form>
      </div>

      <ul className="border bg-white rounded-2xl divide-y">
        {entries.map((e) => (
          <li key={e.id} className="p-4 text-sm grid md:grid-cols-6 gap-2">
            <span className="col-span-1 font-medium">{e.time}</span>
            <span className="col-span-4">{e.task}</span>
            <span className="col-span-1 justify-self-end">Shift</span>
          </li>
        ))}
        {entries.length === 0 && <li className="p-4 text-sm text-gray-500">No entries for this day.</li>}
      </ul>
    </section>
  );
}