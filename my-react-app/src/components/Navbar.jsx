import { useState } from "react"
import {X, Menu} from 'lucide-react'  //npm install lucide-react
import placeholder from '../assets/placeholder.png'
import {navItems } from "../content/index"
import { useNavigate, NavLink } from "react-router-dom"

// navbar recieves the user Role and toggle function as props
const Navbar = ({User, onToggleLogin}) => {
    // state hook for mobile and for sign/out
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    
    const [isLoggedIn, SetisLoggedIn] = useState(false)
    
    const navigate = useNavigate()
    
    const toggleNavbar = () =>{
        setMobileDrawerOpen(!mobileDrawerOpen)
    }

    const handleLogin = () => {
        if (isLoggedIn) { 
            //if user is logged in and wants to logout setlogin state to false
            SetisLoggedIn(false) 
        } else{
            // if user is not logged in take user to login page
            navigate('/login')
        }
    }

    // TODO: handleLogout

    // determine button text based on userRole
    const bttnText = User
    ? `Sign Out(${User.charAt(0).toUpperCase() + User.slice(1)})`
    : "Sign In"

  return (
    <div className="navbar">
        {/* logo*/}
        <img src={placeholder} alt="logo" className="logo"/>

        {/* desktop nav */}
        <ul className="dekstop-nav">
            {navItems.map((item, index) => (
                <li key={index}>
                    <NavLink
                        to={item.href}>
                        {item.label}
                    </NavLink>
                </li>
            ))}
        </ul>

        {/* sign in button */}
        <button onClick={handleLogin} className="signin-bttn">
            {bttnText}
        </button>

        {/* mobile menu */}
        <div className="Mobile-menu-toggle">
            <button onClick={toggleNavbar} className="menu-bttn">
                {mobileDrawerOpen ? <X/> : <Menu/>}    
            </button>
        </div>
        {/* will show drawer only on mobile device, fix css */}
        {mobileDrawerOpen && (
            <div className="mobile-nav">
                <ul>
                    {navItems.map((item, index) => (
                    <li key={index}>
                        <NavLink
                            to={item.href}
                            onClick ={()=>setMobileDrawerOpen(false)}
                            >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
                </ul>
            </div>
        )}
    </div>
  )
}

export default Navbar