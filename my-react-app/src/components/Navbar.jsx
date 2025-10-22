import { useState } from "react"
import {X, Menu} from 'lucide-react'  //npm install lucide-react
import placeholder from '../assets/placeholder.png'
import {navItems } from "../content/index"

// navbar recieves the user Role and toggle function as props
const Navbar = ({User, onToggleLogin}) => {
    // state hook for mobile and for sign/out
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    
    const [isLoggedIn, SetisLoggedIn] = useState(false)

    const toggleNavbar = () =>{
        setMobileDrawerOpen(!mobileDrawerOpen)
    }

    const handleLogin = () => {
        SetisLoggedIn(!isLoggedIn)
    }

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
                    <a href={item.href}>{item.label}</a>
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
                        <a href={item.href}>{item.label}</a>
                    </li>
                ))}
                </ul>
            </div>
        )}
    </div>
  )
}

export default Navbar