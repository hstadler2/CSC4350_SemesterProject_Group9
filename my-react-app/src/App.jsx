import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import AppointmentsPage from './pages/AppointmentsPage'

function Home() {
  return (
    <div className="card">
      <h1>MediTrack</h1>
      <p className="read-the-docs">Welcome — use the nav to open Appointments.</p>
    </div>
  )
}

// Temporary nav so I can get to pages while a teammate builds the real navbar
function Nav() {
  const { pathname } = useLocation()
  const active = (p) => ({ textDecoration: pathname === p ? 'underline' : 'none' })
  return (
    <nav style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:20 }}>
      <Link to="/" style={active('/')}>Home</Link>
      <Link to="/appointments" style={active('/appointments')}>Appointments</Link>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}