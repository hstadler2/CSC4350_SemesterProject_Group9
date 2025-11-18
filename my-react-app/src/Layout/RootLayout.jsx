import Navbar from "../components/navbar"
import { Outlet } from "react-router-dom"
import { AuthContextProvider } from "../context/AuthContext"
import Footer from "../components/Footer"

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <div className="page-wrapper">
          <Navbar/>
          <div className="content-wrapper">
            <Outlet/>
          </div>
            <Footer/>
      </div>
    </AuthContextProvider>
  )
}

export default RootLayout