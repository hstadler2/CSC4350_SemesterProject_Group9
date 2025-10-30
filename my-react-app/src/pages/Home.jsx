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
    return(
      //  MAY BE BETTER TO CREATE PATIENT AND COTOR DASHBORAD COMPONENTS AND CALL THEM HERE
      <div data-testid = 'home-page-doctor'>
        <h1>Doctor Dashboard</h1>
        <p>View your appointment schedule and pateint charts.</p>
        <button>View Schedule</button>
        <button>Prescribe Medication</button>

      </div>
    )
  }

  if (role === 'patient'){
    return(
      <div data-testid = 'home-page-patient'>
        <h1>Patient Dashboard</h1>
        <p>Manage your appointments or request refills</p>
        <button>Book Appointment</button>
        <button>Request refill</button>
      </div>
    )
  }
  // unexpected roles
  return <div> User not recognized.</div>
}

export default Home