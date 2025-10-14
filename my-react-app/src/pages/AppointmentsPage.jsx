// src/pages/AppointmentsPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { addAppointment, loadAppointments, removeAppointment } from '../lib/appointmentsStore'

const initialForm = {
  patient: '',
  reason: '',
  date: '',
  start: '',
  durationMins: '30',
  provider: '',
  location: '',
}

export default function AppointmentsPage() {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setItems(loadAppointments())
  }, [])

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => new Date(a.startIso) - new Date(b.startIso))
  }, [items])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function validate() {
    const errs = {}
    if (!form.patient.trim()) errs.patient = 'Patient is required'
    if (!form.date) errs.date = 'Date is required'
    if (!form.start) errs.start = 'Start time is required'
    if (!/^\d+$/.test(form.durationMins) || Number(form.durationMins) <= 0) {
      errs.durationMins = 'Duration must be a positive number of minutes'
    }
    return errs
  }

  function onSubmit(e) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return

    // Build ISO from local date+time
    const startIso = new Date(`${form.date}T${form.start}:00`).toISOString()

    const newItems = addAppointment({
      patient: form.patient.trim(),
      reason: form.reason.trim(),
      provider: form.provider.trim(),
      location: form.location.trim(),
      durationMins: Number(form.durationMins),
      startIso,
    })
    setItems(newItems)
    setForm(initialForm)
    setErrors({})
  }

  function onDelete(id) {
    setItems(removeAppointment(id))
  }

  return (
    <div className="card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'left' }}>
      <h2>Appointments</h2>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <label>Patient*</label><br />
          <input name="patient" value={form.patient} onChange={handleChange} placeholder="Jane Doe" />
          {errors.patient && <div style={{ color: 'salmon' }}>{errors.patient}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Date*</label><br />
            <input type="date" name="date" value={form.date} onChange={handleChange} />
            {errors.date && <div style={{ color: 'salmon' }}>{errors.date}</div>}
          </div>
          <div>
            <label>Start Time*</label><br />
            <input type="time" name="start" value={form.start} onChange={handleChange} />
            {errors.start && <div style={{ color: 'salmon' }}>{errors.start}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Duration (mins)*</label><br />
            <input name="durationMins" value={form.durationMins} onChange={handleChange} />
            {errors.durationMins && <div style={{ color: 'salmon' }}>{errors.durationMins}</div>}
          </div>
          <div>
            <label>Provider</label><br />
            <input name="provider" value={form.provider} onChange={handleChange} placeholder="Dr. Smith" />
          </div>
        </div>

        <div>
          <label>Location</label><br />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Room 201" />
        </div>

        <div>
          <label>Reason</label><br />
          <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Annual physical / check-up" />
        </div>

        <div>
          <button type="submit">Create appointment</button>
        </div>
      </form>

      <hr style={{ margin: '24px 0' }} />

      <h3 style={{ marginTop: 0 }}>Upcoming</h3>
      {sorted.length === 0 ? (
        <p className="read-the-docs">No appointments yet. Add one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
          {sorted.map(a => (
            <li key={a.id} style={{ border: '1px solid #444', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <strong>{a.patient}</strong>
                <button onClick={() => onDelete(a.id)}>Delete</button>
              </div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>
                <div>{fmtDateTime(a.startIso)} • {a.durationMins} mins</div>
                {a.provider && <div>Provider: {a.provider}</div>}
                {a.location && <div>Location: {a.location}</div>}
                {a.reason && <div>Reason: {a.reason}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function fmtDateTime(iso) {
  const d = new Date(iso)
  const date = d.toLocaleDateString()
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${date} @ ${time}`
}
