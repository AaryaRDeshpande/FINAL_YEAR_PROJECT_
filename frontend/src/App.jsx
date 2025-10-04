import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'

function AppContent() {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className="app">
      <ParticleBackground />
      {!isAuthPage && <Header />}
      <main className={`main-content ${isDashboard ? 'dashboard-main' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
      <ScrollToTop />
    </div>
  )
}

export default function App(){
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
