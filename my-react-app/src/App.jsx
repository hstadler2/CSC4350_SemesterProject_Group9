import { useState } from 'react'
import Navbar from './components/navbar'
import Home from './pages/Home'

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
    <div>
      {/* pass state to Navbar and role to home page*/}
      <Navbar User={User} onToggleLogin={handleToggleLogin}/>
      <Home User={User}/>
    </div>
  )
}

export default App