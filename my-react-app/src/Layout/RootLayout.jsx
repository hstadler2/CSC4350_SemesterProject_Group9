import Navbar from "../components/navbar"
import { Outlet } from "react-router-dom"

const RootLayout = ({User, onToggleLogin}) => {
  return (
    <div>
        <Navbar User={User} onToggleLogin={onToggleLogin}/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default RootLayout