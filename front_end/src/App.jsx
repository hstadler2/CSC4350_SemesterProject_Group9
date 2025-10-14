import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Appointment from "./pages/Appointment";
import HealthRecords from "./pages/HealthRecords";
import Prescriptions from "./pages/Prescriptions";
import Schedule from "./pages/Schedule";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />

      {/* Student Pages */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/health-records" element={<HealthRecords />} />
      <Route path="/prescriptions" element={<Prescriptions />} />

      {/* Staff Pages */}
      <Route path="/staff-dashboard" element={<StaffDashboard />} />
      <Route path="/schedule" element={<Schedule />} />
    </Routes>
  );
}

export default App;
