// src/pages/Prescriptions.jsx
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const Prescriptions = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW: refill request history for the selected prescription
  const [refillRequests, setRefillRequests] = useState([]);
  const [refillError, setRefillError] = useState("");

  // Fetch prescriptions for current user
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPrescriptions = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Error loading prescriptions:", error);
        setError(error.message || "Failed to load prescriptions.");
        setPrescriptions([]);
      } else {
        // Normalize DB rows into the shape your UI already expects
        const normalized = (data || []).map((row) => ({
          id: row.id,
          name: row.name,
          dosage: row.dosage,
          prescribingDoctor: row.prescribing_doctor,
          startDate: row.start_date,
          endDate: row.end_date,
          status: row.status, // "active" | "completed"
          notes: row.notes,
          refillsLeft: row.refills_left,
          lastFilled: row.last_filled,
          pharmacy: row.pharmacy,
        }));
        setPrescriptions(normalized);
      }

      setLoading(false);
    };

    fetchPrescriptions();
  }, [userId]);

  // When data changes, ensure we always have a valid selected prescription
  useEffect(() => {
    if (!prescriptions.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !prescriptions.find((p) => p.id === selectedId)) {
      setSelectedId(prescriptions[0].id);
    }
  }, [prescriptions, selectedId]);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => {
      const matchesStatus =
        statusFilter === "all" ? true : p.status === statusFilter;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.prescribingDoctor.toLowerCase().includes(q) ||
        p.pharmacy.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [prescriptions, search, statusFilter]);

  const selected =
    filteredPrescriptions.find((p) => p.id === selectedId) ||
    filteredPrescriptions[0] ||
    null;

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleRequestRefill = async () => {
    if (!selected || !userId) return;
    if (selected.status !== "active" || selected.refillsLeft === 0) return;

    try {
      const { error } = await supabase
        .from("prescription_refill_requests")
        .insert([
          {
            user_id: userId,
            prescription_id: selected.id,
            status: "pending",
          },
        ]);

      if (error) throw error;
      alert(`Refill request sent for ${selected.name}`);

      // After a successful request, refresh refill history
      await fetchRefillRequests(selected.id);
    } catch (err) {
      console.error("Error requesting refill:", err);
      alert("Failed to send refill request. Please try again.");
    }
  };

  // Helper to fetch refill requests for a prescription
  const fetchRefillRequests = async (prescriptionId) => {
    if (!userId || !prescriptionId) {
      setRefillRequests([]);
      return;
    }

    try {
      setRefillError("");
      const { data, error } = await supabase
        .from("prescription_refill_requests")
        .select("*")
        .eq("user_id", userId)
        .eq("prescription_id", prescriptionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRefillRequests(data || []);
    } catch (err) {
      console.error("Error loading refill requests:", err);
      setRefillError(err.message || "Failed to load refill history.");
      setRefillRequests([]);
    }
  };

  // Fetch refill requests whenever the selected prescription changes
  useEffect(() => {
    if (selected?.id) {
      fetchRefillRequests(selected.id);
    } else {
      setRefillRequests([]);
      setRefillError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, userId]);

  if (!session?.user) {
    return (
      <div className="prescriptions-page">
        <h1>Prescriptions</h1>
        <p>Please log in to view your prescriptions.</p>
      </div>
    );
  }

  return (
    <div className="prescriptions-page">
      <header className="prescriptions-header">
        <div>
          <h1>Prescriptions</h1>
          <p>View your current medications, refills, and history.</p>
        </div>
        <button
          className="pill-button pill-button--primary"
          type="button"
          onClick={() => alert("Add prescription flow coming soon")}
        >
          + Add prescription
        </button>
      </header>

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

      <section className="prescriptions-layout">
        <div className="prescriptions-list" aria-label="Prescription list">
          {loading ? (
            <div className="empty-state">
              <p>Loading prescriptions...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p style={{ color: "red" }}>{error}</p>
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="empty-state">
              <p>No prescriptions match your search.</p>
            </div>
          ) : (
            filteredPrescriptions.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`prescription-card ${
                  selected && selected.id === p.id
                    ? "prescription-card--active"
                    : ""
                }`}
                onClick={() => handleSelect(p.id)}
              >
                <div className="prescription-card__top">
                  <h3>{p.name}</h3>
                  <span
                    className={`status-pill status-pill--${p.status}`}
                  >
                    {p.status === "active" ? "Active" : "Completed"}
                  </span>
                </div>

                <p className="prescription-card__dosage">{p.dosage}</p>

                <div className="prescription-card__meta">
                  <span>{p.prescribingDoctor}</span>
                  <span>Refills left: {p.refillsLeft}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="prescription-detail">
          {selected ? (
            <>
              <div className="detail-header">
                <div>
                  <h2>{selected.name}</h2>
                  <p className="detail-subtitle">{selected.dosage}</p>
                </div>
                <span
                  className={`status-pill status-pill--${selected.status}`}
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
                  <p>{selected.endDate}</p>
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
                <h4>Instructions & notes</h4>
                <p>{selected.notes}</p>
              </div>

              {/* NEW: Refill history */}
              <div className="detail-notes">
                <h4>Refill requests</h4>
                {refillError && (
                  <p style={{ color: "red", fontSize: "0.85rem" }}>
                    {refillError}
                  </p>
                )}
                {!refillError && refillRequests.length === 0 && (
                  <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    No refill requests yet.
                  </p>
                )}
                {!refillError && refillRequests.length > 0 && (
                  <ul style={{ fontSize: "0.9rem", color: "#1e293b" }}>
                    {refillRequests.map((r) => (
                      <li key={r.id}>
                        {new Date(r.created_at).toLocaleString()} –{" "}
                        <strong>{r.status}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="detail-actions">
                <button
                  type="button"
                  className="pill-button pill-button--primary"
                  disabled={
                    selected.status !== "active" ||
                    selected.refillsLeft === 0
                  }
                  onClick={handleRequestRefill}
                >
                  {selected.refillsLeft === 0
                    ? "No refills remaining"
                    : "Request refill"}
                </button>
                <button
                  type="button"
                  className="pill-button pill-button--ghost"
                  onClick={() => window.print()}
                >
                  Download summary
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Select a prescription to view details.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Prescriptions;
