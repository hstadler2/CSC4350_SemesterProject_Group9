import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      nav("/");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto border bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-xl font-bold mb-4">Log in</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn-primary">Sign in</button>
      </form>
      <p className="text-xs text-gray-500 mt-3">Hint: any email works in this demo. Use name@staff.edu to log in as staff.</p>
    </div>
  );
}
const btnStyle = {
  color: "white",
  background: "blue",
  padding: "10px 15px",
  borderRadius: "5px",
  textDecoration: "none",
};
