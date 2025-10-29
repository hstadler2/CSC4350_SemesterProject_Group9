import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-bold">Hi {user?.name || "student"}</h1>
      <p className="text-gray-600">What would you like to do today?</p>
      <div className="grid md:grid-cols-3 gap-4">
        <Tile to="/appointments" title="Book Appointment" subtitle="Choose date & reason" />
        <Tile to="/records" title="Health Records" subtitle="Upload & view files" />
        <Tile to="/prescriptions" title="Prescriptions" subtitle="View current meds" />
      </div>
    </section>
  );
}

function Tile({ to, title, subtitle }) {
  return (
    <Link to={to} className="border rounded-2xl bg-white p-5 hover:shadow-md transition block">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </Link>
  );
}