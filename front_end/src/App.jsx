import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Appointment from "./pages/Appointment";
import HealthRecords from "./pages/HealthRecords";
import Prescriptions from "./pages/Prescriptions";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded hover:bg-gray-100 transition ${
        location.pathname === to ? "font-semibold underline" : ""
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sky-700">CampusCare</span>
          {link("/", "Home")}
          {user && link("/appointments", "Appointments")}
          {user && link("/prescriptions", "Prescriptions")}
          {user && link("/records", "Records")}
          {user && link("/schedule", "Schedule")}
          {user && link("/settings", "Settings")}
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              {link("/login", "Log in")}
              {link("/register", "Register")}
            </>
          ) : (
            <>
              {user.role === "student" && link("/student", "Student")}
              {user.role === "staff" && link("/staff", "Staff")}
              <button
                onClick={logout}
                className="px-3 py-2 border rounded hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={["staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

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

          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            }
          />

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
