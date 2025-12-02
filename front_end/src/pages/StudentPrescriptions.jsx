// src/pages/StudentPrescriptions.jsx
import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "../supabaseClient";

const DUMMY_ACTIVE = [
  {
    id: 1,
    name: "Amoxicillin 500 mg",
    dosage: "500 mg • 1 cap x3/day",
    prescribingDoctor: "Dr. Smith",
    startDate: "2024-10-01",
    endDate: "2025-02-01",
    status: "active",
    notes: "Take with food. Finish full course.",
    refillsLeft: 1,
    lastFilled: "2024-12-15",
    pharmacy: "CVS Pharmacy",
  },
  {
    id: 2,
    name: "Albuterol HFA Inhaler",
    dosage: "2 puffs • x2/day",
    prescribingDoctor: "Dr. Martinez",
    startDate: "2024-08-12",
    endDate: "",
    status: "active",
    notes: "Use during shortness of breath.",
    refillsLeft: 3,
    lastFilled: "2025-01-06",
    pharmacy: "Walgreens",
  },
];

const DUMMY_HISTORY = [
  {
    id: 3,
    name: "Ibuprofen 200 mg",
    dosage: "200 mg • x3/day",
    prescribingDoctor: "Dr. Kim",
    startDate: "2024-04-01",
    endDate: "2024-07-20",
    status: "completed",
    notes: "As needed for pain.",
    refillsLeft: 0,
    lastFilled: "2024-06-10",
    pharmacy: "CVS Pharmacy",
  },
];

// 🔹 toggle: false = use Supabase, true = use dummy data only
const USE_FAKE_DATA = false;

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

export default function Prescriptions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [activePrescriptions, setActivePrescriptions] = useState(
    USE_FAKE_DATA ? DUMMY_ACTIVE : []
  );
  const [historyPrescriptions, setHistoryPrescriptions] = useState(
    USE_FAKE_DATA ? DUMMY_HISTORY : []
  );

  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(!USE_FAKE_DATA);
  const [error, setError] = useState(null);

  // 🔹 Load data from Supabase (if not using dummy)
  useEffect(() => {
    if (USE_FAKE_DATA) {
      // pick first active dummy as selected
      if (DUMMY_ACTIVE.length > 0) {
        setSelectedId(DUMMY_ACTIVE[0].id);
      }
      return;
    }

    async function fetchPrescriptions() {
      setLoading(true);
      setError(null);

      // TODO later: filter by logged-in student user_id
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading prescriptions:", error);
        setError("Failed to load prescriptions.");
        setLoading(false);
        return;
      }

      // map DB fields (snake_case) → UI shape (camelCase)
      const mapped =
        (data || []).map((row) => ({
          id: row.id,
          name: row.name,
          dosage: row.dosage,
          prescribingDoctor: row.prescribing_doctor,
          startDate: row.start_date,
          endDate: row.end_date,
          status: row.status,
          notes: row.notes,
          refillsLeft: row.refills_left,
          lastFilled: row.last_filled,
          pharmacy: row.pharmacy,
          userId: row.user_id, // 👈 NEW: keep track of who this belongs to
        })) || [];

      const active = mapped.filter((p) => p.status === "active");
      const history = mapped.filter((p) => p.status !== "active");

      setActivePrescriptions(active);
      setHistoryPrescriptions(history);

      // default selection: first active, otherwise first in history
      const first = active[0] || history[0] || null;
      setSelectedId(first ? first.id : null);

      setLoading(false);
    }

    fetchPrescriptions();
  }, []);

  // all prescriptions (active + history)
  const allPrescriptions = useMemo(
    () => [...activePrescriptions, ...historyPrescriptions],
    [activePrescriptions, historyPrescriptions]
  );

  // filter by status + search
  const filtered = useMemo(() => {
    return allPrescriptions.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;

      return (
        p.name.toLowerCase().includes(q) ||
        p.prescribingDoctor.toLowerCase().includes(q) ||
        p.pharmacy.toLowerCase().includes(q)
      );
    });
  }, [allPrescriptions, search, statusFilter]);

  const selected =
    filtered.find((p) => p.id === selectedId) || filtered[0] || null;

  const activeFiltered = filtered.filter((p) => p.status === "active");

  // 🔹 Download summary
  const handleDownloadSummary = () => {
    if (!selected) return;

    const content = [
      "Prescription Summary",
      "---------------------",
      `Name: ${selected.name}`,
      `Dosage: ${selected.dosage}`,
      `Prescribing doctor: ${selected.prescribingDoctor}`,
      `Pharmacy: ${selected.pharmacy}`,
      `Start date: ${selected.startDate}`,
      `End date: ${selected.endDate || "Ongoing"}`,
      `Last filled: ${selected.lastFilled}`,
      `Refills left: ${selected.refillsLeft}`,
      "",
      "Notes:",
      selected.notes || "None",
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescription-${selected.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 🔹 Request refill – now stored in Supabase
  const handleRequestRefill = async () => {
    if (!selected) return;

    if (selected.refillsLeft <= 0) {
      alert("No refills remaining. Please contact your provider directly.");
      return;
    }

    try {
      const { error } = await supabase
        .from("prescription_refill_requests")
        .insert({
          prescription_id: selected.id,
          user_id: selected.userId ?? null,
          status: "pending",
          // created_at uses DEFAULT now() if set in DB
        });

      if (error) {
        console.error("Error creating refill request:", error);
        alert("There was a problem sending your refill request.");
        return;
      }

      alert("Refill request sent. Your provider will review it.");
    } catch (err) {
      console.error("Unexpected error creating refill request:", err);
      alert("There was a problem sending your refill request.");
    }
  };

  // simple loading / error states
  if (loading) {
    return (
      <div className="prescriptions-page">
        <p>Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescriptions-page">
        <p>{error}</p>
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
            <h1>Prescriptions</h1>
            <p>Manage active medications, request refills, and view history.</p>
          </div>
        </div>

        <div className="prescriptions-header__right">
          <span className="active-count">
            {activePrescriptions.length} active
          </span>
          <button
            className="pill-button pill-button--primary"
            type="button"
            onClick={() => alert("Add prescription flow coming soon")}
          >
            + Add prescription
          </button>
        </div>
      </header>

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

      {/* MAIN LAYOUT: LIST + DETAIL */}
      <section className="prescriptions-layout">
        {/* LEFT: ACTIVE LIST */}
        <div className="prescriptions-list">
          <div className="list-header">
            <h2>Active Prescriptions</h2>
            <span>{activePrescriptions.length} total</span>
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
                onClick={() => setSelectedId(p.id)}
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

        {/* RIGHT: DETAIL PANEL */}
        <div className="prescription-detail">
          {selected ? (
            <>
              <div className="detail-header">
                <div>
                  <h2>{selected.name}</h2>
                  <p className="detail-subtitle">{selected.dosage}</p>
                </div>
                <span
                  className={`status-pill status-pill--${
                    selected.status === "active" ? "active" : "completed"
                  }`}
                >
                  {selected.status === "active" ? "Active" : "Completed"}
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <h4>Prescribing doctor</h4>
                  <p>{selected.prescribingDoctor}</p>
                </div>
                <div>
                  <h4>Pharmacy</h4>
                  <p>{selected.pharmacy}</p>
                </div>
                <div>
                  <h4>Start date</h4>
                  <p>{selected.startDate}</p>
                </div>
                <div>
                  <h4>End date</h4>
                  <p>{selected.endDate || "Ongoing"}</p>
                </div>
                <div>
                  <h4>Last filled</h4>
                  <p>{selected.lastFilled}</p>
                </div>
                <div>
                  <h4>Refills left</h4>
                  <p>{selected.refillsLeft}</p>
                </div>
              </div>

              <div className="detail-notes">
                <h4>Notes</h4>
                <p>{selected.notes}</p>
              </div>

              <div className="detail-actions">
                <button
                  type="button"
                  className="pill-button pill-button--primary"
                  onClick={handleRequestRefill}
                >
                  Request Refill
                </button>
                <button
                  type="button"
                  className="pill-button pill-button--ghost"
                  onClick={handleDownloadSummary}
                >
                  Download Summary
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">Select a prescription to view.</div>
          )}
        </div>
      </section>

      {/* HISTORY */}
      <section className="prescriptions-history">
        <h2>History</h2>

        <div className="history-grid">
          {historyPrescriptions.map((p) => (
            <div key={p.id} className="history-card">
              <div className="history-card__title">{p.name}</div>
              <div className="history-card__body">
                <p>Ended: {p.endDate}</p>
                <p>Doctor: {p.prescribingDoctor}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
