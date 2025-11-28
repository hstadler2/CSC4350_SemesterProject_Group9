import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function StaffDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Show all appointments in demo
    setAppointments(api.listAppointments(user?.id || ""));
  }, [user?.id]);

  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-bold">Staff Dashboard</h1>
      <p className="text-gray-600">Quick overview for clinicians and admins.</p>
      <div className="border rounded-2xl bg-white p-4">
        <h2 className="font-semibold mb-2">Today&apos;s Appointments (demo shows student-created)</h2>
        <ul className="divide-y">
          {appointments.length === 0 && <li className="py-3 text-sm text-gray-500">No appointments yet.</li>}
          {appointments.map((a) => (
            <li key={a.id} className="py-3 grid md:grid-cols-4 gap-2 text-sm">
              <span>{new Date(a.date).toLocaleString()}</span>
              <span className="truncate">{a.reason}</span>
              <span className="truncate">{a.notes || "—"}</span>
              <span className="justify-self-end">{a.status || "Requested"}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}