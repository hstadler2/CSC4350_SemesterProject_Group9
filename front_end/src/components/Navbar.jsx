import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const user = session?.user;
  const role = user?.user_metadata?.role;

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="cc-navbar">
      <div className="cc-navbar-container">
        
        {/* LOGO */}
        <div className="cc-logo">CampusCare</div>

        {/* DESKTOP LINKS */}
        <div className="cc-nav-links">
          <NavLink to="/" className="cc-link">
            Home<span className="cc-underline"></span>
          </NavLink>

          {user && (
            <>
              <NavLink to="/appointments" className="cc-link">
                Appointments<span className="cc-underline"></span>
              </NavLink>
              <NavLink to="/prescriptions" className="cc-link">
                Prescriptions<span className="cc-underline"></span>
              </NavLink>
              <NavLink to="/records" className="cc-link">
                Records<span className="cc-underline"></span>
              </NavLink>
              <NavLink to="/schedule" className="cc-link">
                Schedule<span className="cc-underline"></span>
              </NavLink>
              <NavLink to="/settings" className="cc-link">
                Settings<span className="cc-underline"></span>
              </NavLink>
            </>
          )}
        </div>

        {/* AUTH BUTTON */}
        <button className="cc-auth-btn" onClick={handleAuth}>
          {user ? `Logout (${role})` : "Login"}
        </button>

        {/* MOBILE TOGGLE */}
        <div className="cc-mobile-toggle">
          <button onClick={toggleMobile}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="cc-mobile-menu">
          <NavLink to="/" className="cc-mobile-link">Home</NavLink>
          {user && (
            <>
              <NavLink to="/appointments" className="cc-mobile-link">Appointments</NavLink>
              <NavLink to="/prescriptions" className="cc-mobile-link">Prescriptions</NavLink>
              <NavLink to="/records" className="cc-mobile-link">Records</NavLink>
              <NavLink to="/schedule" className="cc-mobile-link">Schedule</NavLink>
              <NavLink to="/settings" className="cc-mobile-link">Settings</NavLink>
            </>
          )}

          <button onClick={handleAuth} className="cc-mobile-auth-btn">
            {user ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
