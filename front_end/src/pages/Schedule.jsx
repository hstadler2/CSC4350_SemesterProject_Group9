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
    setForm((f) => ({ ...f, task: "" }));
  };

  const onDayChange = (d) => {
    setDay(d);
    setEntries(api.getSchedule(d));
  };

  return (
    <div className="patient-dashboard">
      <h1>Schedule</h1>

      <div className="dashboard-sections">
        {/* LEFT: Day selector + add task */}
        <div className="dashboard-section schedule-section">
          <h2>Plan your day</h2>

          <div className="section-content">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "flex-end",
              }}
            >
              {/* Day picker */}
              <div style={{ minWidth: "160px", flex: "1 1 160px" }}>
                <label
                  htmlFor="schedule-day"
                  style={{
                    display: "block",
                    marginBottom: "0.35rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Day
                </label>
                <input
                  id="schedule-day"
                  type="date"
                  value={day}
                  onChange={(e) => onDayChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                />
              </div>

              {/* Add entry form */}
              <form
                onSubmit={add}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  flex: "3 1 260px",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ minWidth: "120px", flex: "1 1 120px" }}>
                  <label
                    htmlFor="schedule-time"
                    style={{
                      display: "block",
                      marginBottom: "0.35rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Time
                  </label>
                  <input
                    id="schedule-time"
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </div>

                <div style={{ minWidth: "200px", flex: "2 1 200px" }}>
                  <label
                    htmlFor="schedule-task"
                    style={{
                      display: "block",
                      marginBottom: "0.35rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Task
                  </label>
                  <input
                    id="schedule-task"
                    type="text"
                    value={form.task}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, task: e.target.value }))
                    }
                    placeholder="e.g. Triage, Room 201 follow-ups"
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="section-button"
                  style={{ alignSelf: "flex-end" }}
                >
                  Add to schedule
                </button>
              </form>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Build out your shift for the selected day. Entries are saved per
              date, so you can plan ahead.
            </p>
          </div>
        </div>

        {/* RIGHT: Day overview */}
        <div className="dashboard-section">
          <h2>Day overview</h2>

          {entries.length === 0 ? (
            <div className="empty-state">
              <p>No entries for this day.</p>
            </div>
          ) : (
            <div className="section-content">
              {entries.map((e) => (
                <div key={e.id} className="prescription-card">
                  <div className="prescription-card__top">
                    <h3>{e.task}</h3>
                    <span className="status-pill status-pill--active">
                      Shift
                    </span>
                  </div>
                  <p className="prescription-card__dosage">
                    Time: {e.time}
                  </p>
                  <div className="prescription-card__meta">
                    <span>{day}</span>
                    <span>&nbsp;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
