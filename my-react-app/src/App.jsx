import { useState } from 'react'
import Navbar from './components/navbar'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RootLayout from './Layout/RootLayout'

const App = () => {
  // state track for current user
  const [User, setUser] = useState(null)

  const handleToggleLogin  = () => {
    if (User){
      // log out, if user is logged in
      setUser(null)
    } else{
      // <---have login form here that determins role--->
      // for now use patient as default
      setUser('patient')
    }
  }
  return (
    <Router>
        <Routes>
          {/* All routes that should include the Navbar go inside RootLayout */}
        <Route element={<RootLayout User={User} onToggleLogin={handleToggleLogin} />}>
          <Route index element={<Home User={User} />} />
          {/* add other protected routes here */}
        </Route>
          
          {/* login and signup should not have navbar */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Routes>
    </Router>
  )
}

export default App