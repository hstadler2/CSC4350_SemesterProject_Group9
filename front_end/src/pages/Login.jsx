import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Login Page</h1>
      <p>Select a role to continue:</p>

      <Link to="/student-dashboard" style={btnStyle}>
        Continue as Student
      </Link>

      <br /><br />

      <Link to="/staff-dashboard" style={btnStyle}>
        Continue as Staff
      </Link>
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
