import Navbar from "../components/navbar"
import { Outlet } from "react-router-dom"
import { AuthContextProvider } from "../context/AuthContext"

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <div>
          <Navbar/>
          <div>
              <Outlet/>
          </div>
      </div>
    </AuthContextProvider>
  )
}

export default RootLayout