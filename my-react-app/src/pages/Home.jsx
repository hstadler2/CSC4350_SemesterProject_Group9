// User is received as a prop
const Home = ({User}) => {

  // if no user show default message
  if (!User) {
    return(
      <div data-testid = "home-page-unauthenticated">
        <h1> Welcome to MediTrack!</h1>
        <p>Please login to access your dashboard.</p>
      </div>
    )
  }

  // display screen for UserRole
  if (User === 'Doctor'){
    return(
      <div data-testid = 'home-page-doctor'>
        <h1>Doctor Dashboard</h1>
        <p>View your appointment schedule and pateint charts.</p>
        <button>View Schedule</button>
        <button>Prescribe Medication</button>

      </div>
    )
  }

  if (User === 'patient'){
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