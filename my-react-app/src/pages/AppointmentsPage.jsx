import { useEffect, useMemo, useState } from 'react'
import { addAppointment, loadAppointments, removeAppointment } from '../lib/appointmentsStore'
import { getProviderOptions, getStaffById } from '../lib/staffStore'

const initialForm = {
  patient: '',
  reason: '',
  date: '',
  start: '',
  durationMins: '30',
  providerId: '',   // NEW: link to staff provider
  providerText: '', // fallback if no staff exist yet
  location: '',
}

export default function AppointmentsPage() {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([])
  const [errors, setErrors] = useState({})
  const [providers, setProviders] = useState([])

  useEffect(() => {
    setItems(loadAppointments())
    setProviders(getProviderOptions()) // [{value,label}]
  }, [])

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => new Date(a.startIso) - new Date(b.startIso))
  }, [items])

  const hasStaff = providers.length > 0

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function validate(newStartIso) {
    const errs = {}
    if (!form.patient.trim()) errs.patient = 'Patient is required'
    if (!form.date) errs.date = 'Date is required'
    if (!form.start) errs.start = 'Start time is required'
    if (!/^\d+$/.test(form.durationMins) || Number(form.durationMins) <= 0) {
      errs.durationMins = 'Duration must be a positive number of minutes'
    }

    if (hasStaff) {
      if (!form.providerId) errs.providerId = 'Choose a provider'
      else {
        // Check shift coverage + overlap
        const start = new Date(newStartIso)
        const end = new Date(start.getTime() + Number(form.durationMins) * 60 * 1000)

        const shiftOk = isWithinAnyShift(form.providerId, start, end)
        if (!shiftOk) errs.providerId = 'Time is outside provider shift'

        const overlapOk = !hasOverlap(items, form.providerId, start, end)
        if (!overlapOk) errs.start = 'Conflicts with an existing appointment'
      }
    } else {
      // No staff yet: require providerText minimally (optional, but helpful)
      if (!form.providerText.trim()) errs.providerText = 'Enter provider until staff is added'
    }
    return errs
  }

  function onSubmit(e) {
    e.preventDefault()

    // Build ISO from local date+time
    const startIso = new Date(`${form.date}T${form.start}:00`).toISOString()

    const v = validate(startIso)
    setErrors(v)
    if (Object.keys(v).length) return

    const providerName = hasStaff
      ? (getStaffById(form.providerId)?.name || '')
      : form.providerText.trim()

    const newItems = addAppointment({
      patient: form.patient.trim(),
      reason: form.reason.trim(),
      provider: providerName,
      providerId: hasStaff ? form.providerId : null,
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

          {/* Provider input switches to a select once staff exists */}
          <div>
            <label>Provider{hasStaff ? '*' : ''}</label><br />
            {hasStaff ? (
              <select name="providerId" value={form.providerId} onChange={handleChange}>
                <option value="">Select provider</option>
                {providers.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            ) : (
              <input name="providerText" value={form.providerText} onChange={handleChange} placeholder="Dr. Smith" />
            )}
            {hasStaff && errors.providerId && <div style={{ color: 'salmon' }}>{errors.providerId}</div>}
            {!hasStaff && errors.providerText && <div style={{ color: 'salmon' }}>{errors.providerText}</div>}
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

// --- scheduling helpers ---
function toMin(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
function isWithinAnyShift(providerId, start, end) {
  const staff = getStaffById(providerId)
  if (!staff) return false
  const wd = start.getDay() // 0..6
  const startMin = start.getHours() * 60 + start.getMinutes()
  const endMin = end.getHours() * 60 + end.getMinutes()
  return staff.shifts.some(sh =>
    sh.weekday === wd &&
    toMin(sh.start) <= startMin &&
    endMin <= toMin(sh.end)
  )
}
function hasOverlap(items, providerId, start, end) {
  const s = start.getTime()
  const e = end.getTime()
  return items.some(a => {
    if ((a.providerId || null) !== providerId) return false
    const aStart = new Date(a.startIso).getTime()
    const aEnd = aStart + (Number(a.durationMins) * 60 * 1000)
    return Math.max(s, aStart) < Math.min(e, aEnd) // true if overlap
  })
}
