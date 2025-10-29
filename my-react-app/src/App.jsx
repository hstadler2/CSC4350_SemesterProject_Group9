import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import AppointmentsPage from './pages/AppointmentsPage'
import StaffSchedulePage from './pages/StaffSchedulePage'

function Home() {
  return (
    <div className="card">
      <h1>MediTrack</h1>
      <p className="read-the-docs">Use the nav to open Appointments or Staff Schedule.</p>
    </div>
  )
}

function Nav() {
  const { pathname } = useLocation()
  const active = (p) => ({ textDecoration: pathname === p ? 'underline' : 'none' })
  return (
    <nav style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:20 }}>
      <Link to="/" style={active('/')}>Home</Link>
      <Link to="/appointments" style={active('/appointments')}>Appointments</Link>
      <Link to="/staff" style={active('/staff')}>Staff Schedule</Link>
    </nav>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/staff" element={<StaffSchedulePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
