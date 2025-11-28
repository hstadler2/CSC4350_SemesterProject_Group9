// src/pages/HealthRecords.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const HealthRecords = () => {
  const { session } = useAuth();              
  const userId = session?.user?.id || null;   

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // if we don't have a logged-in user yet, don't try to fetch
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("health_records")              // <-- your table name here
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error("Error loading health records:", err);
        setError(err.message || "Failed to load health records.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [userId]);

  // not logged in
  if (!session) {
    return (
      <div className="patient-dashboard">
        <h1>Health Records</h1>
        <p>Please log in to view your records.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="patient-dashboard">
        <h1>Health Records</h1>
        <p>Loading your records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-dashboard">
        <h1>Health Records</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <h1>Health Records</h1>

      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              {/* render whatever fields your table has */}
              <strong>{record.title}</strong> – {record.created_at}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HealthRecords;
