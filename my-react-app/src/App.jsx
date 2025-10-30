import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RootLayout from './Layout/RootLayout'
import { UserAuth } from './context/AuthContext'

const App = () => {
  // state track for current user
  // const [User, setUser] = useState(null) replace with UserAuth
  const {session, signOut, loading} = UserAuth()

  if (loading) {
    return <div>Loading...</div>
  }


  const handleToggleLogin  = async () => {
    if (session){
      // log out, if user is logged in
      await signOut()
    } 
  }

  return (
    <Router>
        <Routes>
          {/* All routes that should include the Navbar go inside RootLayout */}
        <Route element={<RootLayout />}>

        <Route index element={<Home/>} />
        
        
        {/* use if you want to see the login page first
          <Route index element={session ? <Home/> : <Navigate to="/login"/> } /> */}
          
          {/* add other protected routes here */}
        </Route>
          
          {/* login and signup should not have navbar
          prevent user from accessing login page when logged in */}
          <Route path='/login' element={!session ? <Login/> : <Navigate to="/"/>}/>
          <Route path='/signup' element={!session ? <Signup/>:<Navigate to="/"/>}/>
        </Routes>
    </Router>
  )
}

export default App