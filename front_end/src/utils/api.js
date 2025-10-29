const DB_KEY = "campuscare_db_v1";

function load() {
  const json = localStorage.getItem(DB_KEY);
  return json ? JSON.parse(json) : { appointments: [], records: [], prescriptions: [], schedule: {} };
}
function save(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export const api = {
  createAppointment(appt) {
    const db = load();
    const withId = { ...appt, id: crypto.randomUUID(), createdAt: Date.now() };
    db.appointments.push(withId);
    save(db);
    return withId;
  },
  listAppointments(userId) {
    const db = load();
    return db.appointments.filter(a => a.userId === userId);
  },
  addRecord(record) {
    const db = load();
    const withId = { ...record, id: crypto.randomUUID(), createdAt: Date.now() };
    db.records.push(withId);
    save(db);
    return withId;
  },
  listRecords(userId) {
    const db = load();
    return db.records.filter(r => r.userId === userId);
  },
  addPrescription(p) {
    const db = load();
    const withId = { ...p, id: crypto.randomUUID(), createdAt: Date.now() };
    db.prescriptions.push(withId);
    save(db);
    return withId;
  },
  listPrescriptions(userId) {
    const db = load();
    return db.prescriptions.filter(p => p.userId === userId);
  },
  setScheduleDay(day, entries) {
    const db = load();
    db.schedule[day] = entries;
    save(db);
    return entries;
  },
  getSchedule(day) {
    const db = load();
    return db.schedule[day] || [];
  }
};