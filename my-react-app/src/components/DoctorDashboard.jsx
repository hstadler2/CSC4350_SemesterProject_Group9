const DoctorDashboard = () => {
  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      
      <div className='dashboard-sections'>
        {/* Schedule Section */}
        <section className='dashboard-section schedule-section'>
          <h2>Today's Schedule</h2>
          <div className='section-content'>
            <p>View your schedule for today.</p>
            {/* MODIFY TO SHOW SCHEDULE HERE */}
          </div>
        </section>

        {/* Manage Appointments Section */}
        <section className='dashboard-section appointments-section'>
          <h2>Manage Appointments</h2>
          <div className='section-content'>
            <p>Review, approve, or reschedule patient appointment requests.</p>
            <button className='section-button'>Manage Appointments</button>
          </div>
        </section>

        {/* Patient Records Section */}
        <section className='dashboard-section records-section'>
          <h2>Patient Records</h2>
          <div className='section-content'>
            <p>Access and update patient medical records and history.</p>
            <button className='section-button'>View Records</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DoctorDashboard