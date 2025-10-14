import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple React Router example.</p>
      <Link
        to="/login"
        style={{
          color: "white",
          background: "blue",
          padding: "10px 15px",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Go to Login Page
      </Link>
    </div>
  );
}

