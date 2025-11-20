// src/pages/Appointment.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Appointment() {
  const { session } = useAuth();
  const user = session?.user;

  const [form, setForm] = useState({
    date: "",
    reason: "",
    notes: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load appointments
  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (!error) setAppointments(data || []);
      setLoading(false);
    };

    fetchAppointments();
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase.from("appointments").insert([
      {
        user_id: user.id,
        date: form.date,
        reason: form.reason,
        notes: form.notes,
        status: "Requested",
      },
    ]).select().single();

    if (!error) {
      setAppointments((prev) => [data, ...prev]);
      setForm({ date: "", reason: "", notes: "" });
    }
  };

  if (!user) {
    return (
      <div className="patient-dashboard">
        <h1>Appointments</h1>
        <p>Please login to manage appointments.</p>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <h1>Appointments</h1>

      <div className="dashboard-sections">
        {/* NEW APPOINTMENT FORM */}
        <div className="dashboard-section appointments-section">
          <h2>Request Appointment</h2>

          <form onSubmit={submit} className="section-content">
            <div>
              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>

            <div>
              <label>Reason</label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
              />
            </div>

            <div>
              <label>Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                rows="3"
              />
            </div>

            <button className="section-button">
              Submit Request
            </button>
          </form>
        </div>

        {/* APPOINTMENT LIST */}
        <div className="dashboard-section">
          <h2>Your Appointments</h2>

          {loading ? (
            <p>Loading...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <div className="section-content">
              {appointments.map((a) => (
                <div key={a.id} className="prescription-card">
                  <div className="prescription-card__top">
                    <strong>{new Date(a.date).toLocaleString()}</strong>
                    <span className="status-pill status-pill--active">
                      {a.status}
                    </span>
                  </div>

                  <p className="prescription-card__dosage">
                    {a.reason}
                  </p>

                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {a.notes || "No notes provided"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
