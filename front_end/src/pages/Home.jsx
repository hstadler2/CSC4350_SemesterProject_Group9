import DoctorDashboard from "../components/DoctorDashboard";
import PatientDashboard from "../components/PatientDashboard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  // Make sure we don't crash if context is missing
  const auth = useAuth() || {};
  const { session } = auth;

  // While we’re still fetching the session from Supabase
  if (session === undefined) {
    return (
      <div data-testid="home-page-loading">
        <h1>Loading...</h1>
        <p>Please wait while we check your session.</p>
      </div>
    );
  }

  // No active session → unauthenticated view
  if (!session) {
    return (
      <div data-testid="home-page-unauthenticated">
        <h1>Welcome to MediTrack!</h1>
        <p>Please login to access your dashboard.</p>
      </div>
    );
  }

  const user = session.user;
  const role = user?.user_metadata?.role; // get role from metadata safely

  // Display screen for user role
  if (role === "doctor") {
    return <DoctorDashboard />;
  }

  if (role === "patient") {
    return <PatientDashboard />;
  }

  // Unexpected roles
  return (
    <div data-testid="home-page-unknown-role">
      <h1>User not recognized.</h1>
      <p>Please contact support to update your account role.</p>
    </div>
  );
};

export default Home;
