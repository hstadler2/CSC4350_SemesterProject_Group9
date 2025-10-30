import { useState } from "react"
import {X, Menu} from 'lucide-react'  //npm install lucide-react
import placeholder from '../assets/placeholder.png'
import {navItems } from "../content/index"
import { useNavigate, NavLink } from "react-router-dom"
import { UserAuth } from "../context/AuthContext"

// navbar recieves the user Role and toggle function as props
const Navbar = () => {
    // state hook for mobile and for sign/out
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const navigate = useNavigate()
    
    // use UserAuth to access session and signout
    const {session, signOut} = UserAuth()

    
    const toggleNavbar = () =>{
        setMobileDrawerOpen(!mobileDrawerOpen)
    }

    const handleAuthAction = async () => {
        if (session) { 
            //if user is logged in await sign out
            await signOut() 
        } else{
            // if user is not logged in go to login page
            navigate('/login')
        }
    }

    // extract user role
    const userEmail = session?.user?.email || null
    const userRole = session?.user?.user_metadata?.role || 'guest'

    // determine button text based on userRole
    const bttnText = session
    // the userRole: shoudl show signout (admin) or sign out (patient)"
    ? `Sign Out(${userRole})`
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
        <button onClick={handleAuthAction} className="signin-bttn">
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