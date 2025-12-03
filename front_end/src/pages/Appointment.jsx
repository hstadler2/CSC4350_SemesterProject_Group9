// src/pages/Appointment.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

function AppointmentCalendar({ selectedDateTime, onSelectDate }) {
  // selectedDateTime is something like "2025-11-30T15:00"
  const initialDate = selectedDateTime
    ? new Date(selectedDateTime)
    : new Date();

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0–11

  const today = new Date();

  const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getSelectedISO = () => {
    if (!selectedDateTime) return null;
    return selectedDateTime.slice(0, 10); // "YYYY-MM-DD"
  };

  const selectedISO = getSelectedISO();
  const todayISO = new Date().toISOString().slice(0, 10);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startingWeekday = firstDay.getDay(); // 0–6

  const changeMonth = (offset) => {
    let m = viewMonth + offset;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const handleDayClick = (day) => {
    const month = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const isoDate = `${viewYear}-${month}-${d}`;

    // Keep time if already set, otherwise default to 09:00
    const currentTime = selectedDateTime?.split("T")[1] || "09:00";
    onSelectDate(`${isoDate}T${currentTime}`);
  };

  const formatBadge = (iso) => {
    if (!iso) return "No date selected yet";
    const d = new Date(iso + "T00:00");
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="appointment-calendar">
      <header className="appointment-calendar__header">
        <div>
          <p className="appointment-calendar__label">Pick a date</p>
          <h3 className="appointment-calendar__month">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
        </div>
        <div className="appointment-calendar__nav">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </header>

      <div className="appointment-calendar__grid">
        {WEEKDAY_NAMES.map((name) => (
          <div key={name} className="appointment-calendar__weekday">
            {name}
          </div>
        ))}

        {/* leading blanks */}
        {Array.from({ length: startingWeekday }).map((_, idx) => (
          <div key={`blank-${idx}`} className="appointment-calendar__cell" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const month = String(viewMonth + 1).padStart(2, "0");
          const d = String(day).padStart(2, "0");
          const iso = `${viewYear}-${month}-${d}`;

          const isToday = iso === todayISO;
          const isSelected = iso === selectedISO;

          return (
            <button
              key={iso}
              type="button"
              className={[
                "appointment-calendar__cell",
                "appointment-calendar__day",
                isToday ? "appointment-calendar__day--today" : "",
                isSelected ? "appointment-calendar__day--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="appointment-calendar__badge">
        <span className="appointment-calendar__badge-dot" />
        <span>{formatBadge(selectedISO)}</span>
      </div>
    </div>
  );
}

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

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          user_id: user.id,
          date: form.date,
          reason: form.reason,
          notes: form.notes,
          status: "Requested",
        },
      ])
      .select()
      .single();

    if (!error && data) {
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
    <div className="patient-dashboard appointment-page">
      {/* HERO */}
      <section className="appointment-hero">
        <div className="appointment-hero__pill">
          <span className="appointment-hero__dot" />
          Now accepting new appointments
        </div>
        <h1 className="appointment-hero__title">
          Book your next appointment in seconds.
        </h1>
        <p className="appointment-hero__subtitle">
          Choose a date from the calendar, add a reason, and we’ll handle the rest.
          You’ll see all your upcoming and past appointments right here.
        </p>
      </section>

      {/* MAIN LAYOUT */}
      <div className="appointment-layout">
        {/* LEFT: calendar + form */}
        <div className="dashboard-section appointments-section appointment-card">
          <div className="appointment-card__header">
            <h2>Request Appointment</h2>
            <p>Select a date and time that works for you.</p>
          </div>

          <div className="appointment-card__body">
            <AppointmentCalendar
              selectedDateTime={form.date}
              onSelectDate={(value) =>
                setForm((prev) => ({ ...prev, date: value }))
              }
            />

              <form onSubmit={submit} className="section-content appointment-form">
                  <div className="appointment-form__group">
                    <label>Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="appointment-form__group">
                    <label>Reason</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Follow-up consultation"
                      value={form.reason}
                      onChange={(e) =>
                        setForm({ ...form, reason: e.target.value })
                      }
                    />
                  </div>

                  <div className="appointment-form__group">
                    <label>Notes (optional)</label>
                    <textarea
                      className="input-field input-field--textarea"
                      placeholder="Add any extra details you want us to know..."
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
        </div>

        {/* RIGHT: list */}
        <div className="dashboard-section appointment-list">
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
                    <strong>
                      {new Date(a.date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </strong>
                    <span className="status-pill status-pill--active">
                      {a.status}
                    </span>
                  </div>

                  <p className="prescription-card__dosage">{a.reason}</p>

                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      marginTop: "0.25rem",
                    }}
                  >
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
