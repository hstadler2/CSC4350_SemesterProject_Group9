// src/pages/Settings.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Settings() {
  const { session, signOut } = useAuth();
  const user = session?.user || null;

  // If not logged in
  if (!user) {
    return (
      <div className="patient-dashboard">
        <h1>Settings</h1>
        <p>Please log in to manage your account settings.</p>
      </div>
    );
  }

  const [firstName, setFirstName] = useState(user.user_metadata?.firstName || "");
  const [lastName, setLastName] = useState(user.user_metadata?.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        email,
        data: {
          // keep existing metadata & update names
          ...user.user_metadata,
          firstName,
          lastName,
        },
      });

      if (error) throw error;
      setMessage("Your changes were saved.");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="patient-dashboard">
      <h1>Account Settings</h1>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Profile</h2>

          <form onSubmit={handleSave} className="section-content">
            <div>
              <label htmlFor="firstName" style={{ display: "block", marginBottom: "0.25rem" }}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            </div>

            <div>
              <label htmlFor="lastName" style={{ display: "block", marginBottom: "0.25rem" }}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: "block", marginBottom: "0.25rem" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            </div>

            {message && (
              <p style={{ color: message.startsWith("Failed") ? "red" : "green", fontSize: "0.9rem" }}>
                {message}
              </p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.25rem" }}>
              <button
                type="submit"
                className="section-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                onClick={signOut}
                className="pill-button pill-button--ghost"
              >
                Sign out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
