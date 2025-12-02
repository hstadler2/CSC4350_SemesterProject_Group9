// src/pages/StaffPrescriptions.jsx
import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "../supabaseClient";

function PillIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 7.5a4.5 4.5 0 00-6.364-4.045L3.5 14.591A5.5 5.5 0 109.41 20.5L21 9.91A4.48 4.48 0 0021 7.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const EMPTY_FORM = {
  id: null,
  userId: "",
  name: "",
  dosage: "",
  prescribingDoctor: "",
  startDate: "",
  endDate: "",
  status: "active",
  notes: "",
  refillsLeft: 0,
  lastFilled: "",
  pharmacy: "",
};

export default function StaffPrescriptions() {
  // 🔹 prescriptions from Supabase
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingRx, setLoadingRx] = useState(true);
  const [rxError, setRxError] = useState(null);

  // 🔹 “patients” derived from unique user_ids
  const [patients, setPatients] = useState([]); // { id, label }
  const [selectedPatientId, setSelectedPatientId] = useState("all");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedRxId, setSelectedRxId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 refill requests state (from Supabase)
  const [refillRequests, setRefillRequests] = useState([]);
  const [refillError, setRefillError] = useState(null);

  // ─────────────────────────────────────────────
  // Load prescriptions from Supabase
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchPrescriptions() {
      setLoadingRx(true);
      setRxError(null);

      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading prescriptions:", error);
        setRxError("Failed to load prescriptions.");
        setLoadingRx(false);
        return;
      }

      const mapped =
        (data || []).map((row) => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          dosage: row.dosage,
          prescribingDoctor: row.prescribing_doctor,
          startDate: row.start_date || "",
          endDate: row.end_date || "",
          status: row.status || "active",
          notes: row.notes || "",
          refillsLeft: row.refills_left ?? 0,
          lastFilled: row.last_filled || "",
          pharmacy: row.pharmacy || "",
        })) || [];

      setPrescriptions(mapped);

      // build patient list from userId
      const uniqueUserIds = [
        ...new Set(mapped.map((p) => p.userId).filter(Boolean)),
      ];
      const patientOptions = uniqueUserIds.map((id, index) => ({
        id,
        label: `Patient ${index + 1} (${id.slice(0, 8)}…)`,
      }));
      setPatients(patientOptions);

      // default: all patients; and select first prescription if exists
      setSelectedPatientId("all");
      const first = mapped[0] || null;
      setSelectedRxId(first ? first.id : null);
      if (first) {
        setFormData(first);
        setIsEditingExisting(true);
      }

      setLoadingRx(false);
    }

    fetchPrescriptions();
  }, []);

  // ─────────────────────────────────────────────
  // Load refill requests from Supabase
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchRefillRequests() {
      try {
        const { data: requests, error: reqError } = await supabase
          .from("prescription_refill_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (reqError) {
          console.error("Error loading refill requests:", reqError);
          setRefillError("Failed to load refill requests.");
          setRefillRequests([]);
          return;
        }

        // grab prescription names for display
        const { data: rxData, error: rxErr } = await supabase
          .from("prescriptions")
          .select("id, name");

        if (rxErr) {
          console.error("Error loading prescription names:", rxErr);
        }

        const nameMap =
          rxData?.reduce((acc, rx) => {
            acc[rx.id] = rx.name;
            return acc;
          }, {}) || {};

        const mapped =
          (requests || []).map((r) => ({
            id: r.id,
            prescriptionId: r.prescription_id,
            prescriptionName:
              nameMap[r.prescription_id] || "(Unknown prescription)",
            userId: r.user_id,
            status: r.status || "pending",
            createdAt: r.created_at,
          })) || [];

        setRefillRequests(mapped);
      } catch (err) {
        console.error("Unexpected error loading refill requests:", err);
        setRefillError("Failed to load refill requests.");
        setRefillRequests([]);
      }
    }

    fetchRefillRequests();
  }, []);

  // ─────────────────────────────────────────────
  // Derived stuff
  // ─────────────────────────────────────────────

  const prescriptionsForSelectedPatient = useMemo(() => {
    if (selectedPatientId === "all") return prescriptions;
    return prescriptions.filter((p) => p.userId === selectedPatientId);
  }, [prescriptions, selectedPatientId]);

  // filter by status + search
  const filtered = useMemo(() => {
    return prescriptionsForSelectedPatient.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;

      return (
        p.name.toLowerCase().includes(q) ||
        (p.prescribingDoctor || "").toLowerCase().includes(q) ||
        (p.pharmacy || "").toLowerCase().includes(q)
      );
    });
  }, [prescriptionsForSelectedPatient, search, statusFilter]);

  const selected =
    filtered.find((p) => p.id === selectedRxId) || filtered[0] || null;

  const activeFiltered = filtered.filter((p) => p.status === "active");
  const historyFiltered = filtered.filter((p) => p.status === "completed");

  const currentPatientLabel =
    selectedPatientId === "all"
      ? "All patients"
      : patients.find((p) => p.id === selectedPatientId)?.label || "Unknown";

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────

  const handleChangePatient = (e) => {
    const newId = e.target.value;
    setSelectedPatientId(newId);

    const newList =
      newId === "all"
        ? prescriptions
        : prescriptions.filter((p) => p.userId === newId);

    const first = newList[0] || null;
    setSelectedRxId(first ? first.id : null);
    if (first) {
      setFormData(first);
      setIsEditingExisting(true);
    } else {
      setFormData({ ...EMPTY_FORM, userId: newId === "all" ? "" : newId });
      setIsEditingExisting(false);
    }
  };

  const handleNewPrescription = () => {
    const userId = selectedPatientId === "all" ? "" : selectedPatientId || "";
    setSelectedRxId(null);
    setFormData({ ...EMPTY_FORM, userId });
    setIsEditingExisting(false);
  };

  const handleSelectPrescription = (rx) => {
    setSelectedRxId(rx.id);
    setFormData(rx);
    setIsEditingExisting(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "refillsLeft" ? (value === "" ? "" : Number(value) || 0) : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Medication name is required.");
      return;
    }
    if (!formData.userId) {
      alert(
        "User / patient is required. Select a patient in the dropdown before creating a prescription."
      );
      return;
    }

    setSaving(true);
    setRxError(null);

    const payload = {
      user_id: formData.userId,
      name: formData.name,
      dosage: formData.dosage,
      prescribing_doctor: formData.prescribingDoctor,
      start_date: formData.startDate || null,
      end_date: formData.endDate || null,
      status: formData.status,
      notes: formData.notes,
      refills_left:
        formData.refillsLeft === "" ? null : Number(formData.refillsLeft) || 0,
      last_filled: formData.lastFilled || null,
      pharmacy: formData.pharmacy,
    };

    if (isEditingExisting && formData.id) {
      // update
      const { error } = await supabase
        .from("prescriptions")
        .update(payload)
        .eq("id", formData.id);

      if (error) {
        console.error("Error updating prescription:", error);
        setRxError("Failed to save prescription.");
        setSaving(false);
        return;
      }

      // update local state
      setPrescriptions((prev) =>
        prev.map((rx) => (rx.id === formData.id ? { ...formData } : rx))
      );
    } else {
      // insert
      const { data, error } = await supabase
        .from("prescriptions")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        console.error("Error creating prescription:", error);
        setRxError("Failed to create prescription.");
        setSaving(false);
        return;
      }

      const newRx = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        dosage: data.dosage,
        prescribingDoctor: data.prescribing_doctor,
        startDate: data.start_date || "",
        endDate: data.end_date || "",
        status: data.status || "active",
        notes: data.notes || "",
        refillsLeft: data.refills_left ?? 0,
        lastFilled: data.last_filled || "",
        pharmacy: data.pharmacy || "",
      };

      setPrescriptions((prev) => [newRx, ...prev]);
      setSelectedRxId(newRx.id);
      setFormData(newRx);
      setIsEditingExisting(true);

      // if this userId didn’t exist in patients, add it
      if (newRx.userId && !patients.some((p) => p.id === newRx.userId)) {
        const newPatient = {
          id: newRx.userId,
          label: `Patient ${patients.length + 1} (${newRx.userId.slice(
            0,
            8
          )}…)`,
        };
        setPatients((prev) => [...prev, newPatient]);
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selected || !selected.id) return;
    if (!window.confirm("Delete this prescription?")) return;

    const { error } = await supabase
      .from("prescriptions")
      .delete()
      .eq("id", selected.id);

    if (error) {
      console.error("Error deleting prescription:", error);
      setRxError("Failed to delete prescription.");
      return;
    }

    setPrescriptions((prev) => prev.filter((rx) => rx.id !== selected.id));
    setSelectedRxId(null);
    setFormData(EMPTY_FORM);
    setIsEditingExisting(false);
  };

  const handleMarkCompleted = async () => {
    if (!selected || !selected.id) return;

    const { error } = await supabase
      .from("prescriptions")
      .update({ status: "completed" })
      .eq("id", selected.id);

    if (error) {
      console.error("Error marking prescription completed:", error);
      setRxError("Failed to update status.");
      return;
    }

    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === selected.id ? { ...rx, status: "completed" } : rx
      )
    );
    setFormData((prev) => ({ ...prev, status: "completed" }));
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  if (loadingRx) {
    return (
      <div className="prescriptions-page">
        <p>Loading prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="prescriptions-page">
      {/* HEADER */}
      <header className="prescriptions-header">
        <div className="prescriptions-header__left">
          <div className="pill-icon-wrapper">
            <PillIcon />
          </div>
          <div>
            <h1>Prescriptions (Staff)</h1>
            <p>
              Review and manage prescriptions for all patients, and handle
              refill requests.
            </p>
          </div>
        </div>

        <div className="prescriptions-header__right">
          <div className="patient-selector">
            <label htmlFor="patient" className="patient-selector__label">
              Patient
            </label>
            <select
              id="patient"
              className="patient-selector__select"
              value={selectedPatientId}
              onChange={handleChangePatient}
            >
              <option value="all">All patients</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="pill-button pill-button--primary"
            type="button"
            onClick={handleNewPrescription}
          >
            + New prescription
          </button>
        </div>
      </header>

      {/* RX ERROR */}
      {rxError && <p className="text-sm text-red-600 mb-2">{rxError}</p>}

      {/* REFILL REQUESTS PANEL – NEW LAYOUT */}
      <section className="refill-section">
        <h2 className="refill-title">Refill requests</h2>

        {refillError && <p className="refill-error">{refillError}</p>}

        {refillRequests.length === 0 ? (
          <p className="refill-empty">No refill requests at the moment.</p>
        ) : (
          <div className="refill-list">
            {refillRequests.map((req) => (
              <div key={req.id} className="refill-card">
                <div className="refill-med-name">
                  {req.prescriptionName}
                </div>
                <p className="refill-meta-line">
                  Requested at:{" "}
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleString()
                    : "—"}
                </p>
                <p className="refill-meta-line">
                  Status: {req.status || "pending"}
                </p>
                {req.userId && (
                  <p className="refill-meta-line refill-meta-line--muted">
                    User ID: {req.userId}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SEARCH + FILTERS */}
      <section className="prescriptions-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by medication, doctor, or pharmacy"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-chips">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`chip ${
                statusFilter === f.key ? "chip--active" : ""
              }`}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN LAYOUT: LIST + DETAIL/FORM */}
      <section className="prescriptions-layout">
        {/* LEFT: LIST */}
        <div className="prescriptions-list">
          <div className="list-header">
            <h2>Prescriptions for {currentPatientLabel}</h2>
            <span>{activeFiltered.length} active</span>
          </div>

          {activeFiltered.length === 0 ? (
            <div className="empty-state">No active prescriptions.</div>
          ) : (
            activeFiltered.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`prescription-card ${
                  selected && selected.id === p.id
                    ? "prescription-card--active"
                    : ""
                }`}
                onClick={() => handleSelectPrescription(p)}
              >
                <div className="prescription-card__top">
                  <h3>{p.name}</h3>
                  <span className="status-pill status-pill--active">
                    Active
                  </span>
                </div>
                <p className="prescription-card__dosage">{p.dosage}</p>
                <div className="prescription-card__meta">
                  <span>{p.prescribingDoctor}</span>
                  <span>{p.refillsLeft} refills</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* RIGHT: DETAIL + EDIT FORM */}
        <div className="prescription-detail">
          <div className="detail-header">
            <div>
              <h2>
                {isEditingExisting ? "Edit prescription" : "New prescription"}
              </h2>
              {selected && isEditingExisting && (
                <p className="detail-subtitle">{selected.name}</p>
              )}
            </div>
            {formData.status && (
              <span
                className={`status-pill status-pill--${
                  formData.status === "active" ? "active" : "completed"
                }`}
              >
                {formData.status === "active" ? "Active" : "Completed"}
              </span>
            )}
          </div>

          <div className="detail-grid detail-grid--form">
            <div>
              <h4>Patient user_id</h4>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleFormChange}
                placeholder="Supabase user_id"
              />
            </div>
            <div>
              <h4>Medication name</h4>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>Dosage & instructions</h4>
              <input
                type="text"
                name="dosage"
                placeholder="e.g. 500 mg • 1 cap x3/day"
                value={formData.dosage}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>Prescribing doctor</h4>
              <input
                type="text"
                name="prescribingDoctor"
                value={formData.prescribingDoctor}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>Pharmacy</h4>
              <input
                type="text"
                name="pharmacy"
                value={formData.pharmacy}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>Start date</h4>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>End date</h4>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>Last filled</h4>
              <input
                type="date"
                name="lastFilled"
                value={formData.lastFilled}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>Refills left</h4>
              <input
                type="number"
                min="0"
                name="refillsLeft"
                value={formData.refillsLeft}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <h4>Status</h4>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="detail-notes detail-notes--form">
              <h4>Notes</h4>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="pill-button pill-button--primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditingExisting
                ? "Save changes"
                : "Create prescription"}
            </button>

            {isEditingExisting && selected && (
              <>
                <button
                  type="button"
                  className="pill-button pill-button--ghost"
                  onClick={handleMarkCompleted}
                >
                  Mark as completed
                </button>
                <button
                  type="button"
                  className="pill-button pill-button--danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="prescriptions-history">
        <h2>History ({currentPatientLabel})</h2>

        <div className="history-grid">
          {historyFiltered.length === 0 ? (
            <div className="empty-state">No historical prescriptions.</div>
          ) : (
            historyFiltered.map((p) => (
              <div key={p.id} className="history-card">
                <div className="history-card__title">{p.name}</div>
                <div className="history-card__body">
                  <p>Ended: {p.endDate || "—"}</p>
                  <p>Doctor: {p.prescribingDoctor}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
