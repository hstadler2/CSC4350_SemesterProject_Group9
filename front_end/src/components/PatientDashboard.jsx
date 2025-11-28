
const PatientDashboard = () => {
  return (
    <div className='patient-dashboard'>
      <h1>Patient Dashboard</h1>
      
      <div className='dashboard-sections'>
        {/* Appointments Section */}
        <section className='dashboard-section appointments-section'>
          <h2>Upcoming Appointments</h2>
          <div className='section-content'>
            <p>View and manage your scheduled appointments with healthcare providers.</p>
            {/* MODIFY TO SHOW APPOINTMENT DATA */}
          </div>
        </section>

        {/* Prescription Section */}
        <section className='dashboard-section prescription-section'>
          <h2>Request Prescription</h2>
          <div className='section-content'>
            <p>Request prescription refills or submit new prescription requests to your doctor.</p>
            <button className='section-button'>New Request</button>
          </div>
        </section>

        {/* Documents Section */}
        <section className='dashboard-section results-section'>
          <h2>Results</h2>
          <div className='section-content'>
            <p>View lab results.</p>
            <button className='section-button'>View Results</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PatientDashboard