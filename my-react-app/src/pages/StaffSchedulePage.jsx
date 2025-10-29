import { useEffect, useMemo, useState } from 'react'
import {
  addShift, addStaff, getStaffById, loadStaff, removeShift, removeStaff
} from '../lib/staffStore'

const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const initial = { name: '' }
const initialShift = { staffId: '', weekday: '1', start: '09:00', end: '17:00' } // Mon 9–5

export default function StaffSchedulePage() {
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState(initial)
  const [shift, setShift] = useState(initialShift)
  const [errors, setErrors] = useState({})

  useEffect(() => { setStaff(loadStaff()) }, [])

  const staffOptions = useMemo(() =>
    staff.map(s => ({ value: s.id, label: s.name })), [staff]
  )

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  function handleShift(e) {
    const { name, value } = e.target
    setShift(s => ({ ...s, [name]: value }))
  }

  function onAddStaff(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setErrors({ name: 'Name is required' }); return
    }
    const next = addStaff(form.name)
    setStaff(next)
    setForm(initial)
    setErrors({})
  }

  function onAddShift(e) {
    e.preventDefault()
    const errs = {}
    if (!shift.staffId) errs.staffId = 'Choose staff'
    if (!isValidTime(shift.start) || !isValidTime(shift.end)) errs.time = 'Bad time'
    if (!errs.time && toMin(shift.start) >= toMin(shift.end)) errs.time = 'Start must be before end'
    setErrors(errs)
    if (Object.keys(errs).length) return

    const next = addShift(shift.staffId, {
      weekday: Number(shift.weekday),
      start: shift.start,
      end: shift.end,
    })
    setStaff(next)
    setShift(s => ({ ...s, start: '09:00', end: '17:00' }))
    setErrors({})
  }

  function onRemoveStaff(id) {
    setStaff(removeStaff(id))
  }

  function onRemoveShift(staffId, shiftId) {
    setStaff(removeShift(staffId, shiftId))
  }

  return (
    <div className="card" style={{ maxWidth: 860, margin: '0 auto', textAlign: 'left' }}>
      <h2>Staff Schedule</h2>

      {/* Add staff */}
      <form onSubmit={onAddStaff} style={{ display:'grid', gap:12, marginBottom:16 }}>
        <div>
          <label>Staff name*</label><br />
          <input name="name" value={form.name} onChange={handle} placeholder="Dr. Smith" />
          {errors.name && <div style={{ color:'salmon' }}>{errors.name}</div>}
        </div>
        <div><button type="submit">Add staff</button></div>
      </form>

      <hr />

      {/* Add shift */}
      <form onSubmit={onAddShift} style={{ display:'grid', gap:12, margin:'16px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:12 }}>
          <div>
            <label>Staff*</label><br />
            <select name="staffId" value={shift.staffId} onChange={handleShift}>
              <option value="">Select staff</option>
              {staffOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.staffId && <div style={{ color:'salmon' }}>{errors.staffId}</div>}
          </div>
          <div>
            <label>Weekday</label><br />
            <select name="weekday" value={shift.weekday} onChange={handleShift}>
              {weekdays.map((w,i) => <option key={i} value={i}>{w}</option>)}
            </select>
          </div>
          <div>
            <label>Start</label><br />
            <input type="time" name="start" value={shift.start} onChange={handleShift} />
          </div>
          <div>
            <label>End</label><br />
            <input type="time" name="end" value={shift.end} onChange={handleShift} />
          </div>
        </div>
        {errors.time && <div style={{ color:'salmon' }}>{errors.time}</div>}
        <div><button type="submit">Add shift</button></div>
      </form>

      {/* List schedules */}
      {staff.length === 0 ? (
        <p className="read-the-docs">No staff yet — add someone above.</p>
      ) : (
        <ul style={{ listStyle:'none', padding:0, display:'grid', gap:14 }}>
          {staff.map(s => (
            <li key={s.id} style={{ border:'1px solid #444', borderRadius:8, padding:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <strong>{s.name}</strong>
                <button onClick={() => onRemoveStaff(s.id)}>Delete Staff</button>
              </div>
              {s.shifts.length === 0 ? (
                <div style={{ opacity:0.8, fontSize:14 }}>No shifts yet.</div>
              ) : (
                <ul style={{ listStyle:'none', padding:0, marginTop:8, display:'grid', gap:8 }}>
                  {s.shifts
                    .slice()
                    .sort((a,b)=>a.weekday-b.weekday || toMin(a.start)-toMin(b.start))
                    .map(sh => (
                    <li key={sh.id} style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:8, padding:8 }}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span>{weekdays[sh.weekday]} • {sh.start}–{sh.end}</span>
                        <button onClick={() => onRemoveShift(s.id, sh.id)}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function isValidTime(t) {
  return /^\d{2}:\d{2}$/.test(t)
}
function toMin(t) {
  const [h,m] = t.split(':').map(Number)
  return h*60 + m
}
