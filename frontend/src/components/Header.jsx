import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const user = localStorage.getItem('user')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const isLandingPage = location.pathname === '/'

  return (
    <header className={`header-nav ${isScrolled ? 'scrolled' : ''} ${isLandingPage ? 'landing-header' : ''}`}>
      <div className="header-container">
        <div className="header-brand" onClick={() => navigate('/')}>
          <div className="brand-icon">⚖️</div>
          <span className="brand-text">LegalAI</span>
        </div>

        <nav className={`header-nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {isLandingPage && (
            <>
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How It Works</a>
              <a href="#about" className="nav-link">About</a>
            </>
          )}
          
          {user ? (
            <div className="user-menu">
              <button className="btn primary" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button className="btn secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn secondary" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="btn primary" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          )}
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}