// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Appointment from "./pages/Appointment";
import HealthRecords from "./pages/HealthRecords";
import StudentPrescriptions from "./pages/StudentPrescriptions";
import StaffPrescriptions from "./pages/StaffPrescriptions";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";

function ProtectedRoute({ children, roles }) {
  const { session } = useAuth();
  const user = session?.user;
  const role = user?.user_metadata?.role;

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // If route is role-restricted and user doesn't match → go home
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* dashboards */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={["staff", "doctor"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* shared pages */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <HealthRecords />
              </ProtectedRoute>
            }
          />

          {/* prescriptions */}
          {/* ANY logged-in user can see student prescriptions */}
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <StudentPrescriptions />
              </ProtectedRoute>
            }
          />

          {/* ONLY staff / doctors can see staff prescriptions */}
          <Route
            path="/staff/prescriptions"
            element={
              <ProtectedRoute roles={["staff", "doctor"]}>
                <StaffPrescriptions />
              </ProtectedRoute>
            }
          />

          {/* schedule & settings */}
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
