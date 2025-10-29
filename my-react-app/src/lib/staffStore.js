const KEY = 'meditrack.staff.v1'

export function loadStaff() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveStaff(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function addStaff(name) {
  const items = loadStaff()
  const next = { id: crypto.randomUUID(), name: name.trim(), shifts: [] }
  items.push(next)
  saveStaff(items)
  return items
}

export function removeStaff(id) {
  const items = loadStaff().filter(s => s.id !== id)
  saveStaff(items)
  return items
}

export function addShift(staffId, shift) {
  // shift: { weekday: 0-6 (Sun=0), start: "HH:MM", end: "HH:MM" }
  const items = loadStaff()
  const ix = items.findIndex(s => s.id === staffId)
  if (ix === -1) return items
  const s = items[ix]
  const nextShift = { id: crypto.randomUUID(), ...shift }
  s.shifts.push(nextShift)
  saveStaff(items)
  return items
}

export function removeShift(staffId, shiftId) {
  const items = loadStaff()
  const ix = items.findIndex(s => s.id === staffId)
  if (ix === -1) return items
  items[ix].shifts = items[ix].shifts.filter(sh => sh.id !== shiftId)
  saveStaff(items)
  return items
}

// helpers for UI
export function getProviderOptions() {
  return loadStaff().map(s => ({ value: s.id, label: s.name }))
}

export function getStaffById(id) {
  return loadStaff().find(s => s.id === id) || null
}
