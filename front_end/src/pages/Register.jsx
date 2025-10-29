import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });

  const onSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    nav("/");
  };

  return (
    <div className="max-w-md mx-auto border bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-xl font-bold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <Text name="name" label="Full name" value={form.name} onChange={setForm} />
        <Text name="email" label="Email" value={form.email} onChange={setForm} />
        <Text type="password" name="password" label="Password" value={form.password} onChange={setForm} />
        <div className="grid gap-1">
          <span className="text-sm">Role</span>
          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <button className="btn-primary">Register</button>
      </form>
    </div>
  );
}

function Text({ name, label, value, onChange, type = "text" }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm">{label}</span>
      <input
        className="input"
        type={type}
        value={value}
        onChange={(e) => onChange((f) => ({ ...f, [name]: e.target.value }))}
      />
    </label>
  );
}