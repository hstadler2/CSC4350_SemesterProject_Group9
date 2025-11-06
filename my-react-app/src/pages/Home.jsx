import DoctorDashboard from "../components/DoctorDashboard"
import PatientDashboard from "../components/PatientDashboard"
import { UserAuth } from "../context/AuthContext"

const Home = () => {
  
  const {session} = UserAuth()

  // if no user show default message
  if (!session) {
    return(
      <div data-testid = "home-page-unauthenticated">
        <h1> Welcome to MediTrack!</h1>
        <p>Please login to access your dashboard.</p>
      </div>
    )
  }

  const user = session.user
  const role = user.user_metadata?.role //get role from metadata

  // display screen for UserRole
  if (role === 'doctor'){
    return <DoctorDashboard/>
  }

  if (role === 'patient'){
    return <PatientDashboard/>
  }

  // unexpected roles
  return <div> User not recognized.</div>
}

export default Home