const KEY = 'meditrack.appointments.v1'

export function loadAppointments() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveAppointments(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function addAppointment(appt) {
  const items = loadAppointments()
  const next = { id: crypto.randomUUID(), ...appt }
  items.push(next)
  saveAppointments(items)
  return items
}

export function removeAppointment(id) {
  const items = loadAppointments().filter(a => a.id !== id)
  saveAppointments(items)
  return items
}
