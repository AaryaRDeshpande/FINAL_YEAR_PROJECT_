import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleSignUp = () => {
    navigate('/signup')
  }

  const handleSignIn = () => {
    navigate('/login')
  }

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">Legal Document Summarizer & Simplifier</h1>
          <p className="hero-subtitle">
            Transform complex legal documents into easy-to-understand summaries with AI-powered analysis. 
            Save time, reduce legal costs, and make informed decisions with our advanced document processing technology.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10x</div>
              <div className="stat-label">Faster Processing</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Documents Processed</div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Document Upload</h3>
              <p>Upload PDF, DOCX, or TXT files with drag-and-drop functionality</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Text Summarization</h3>
              <p>Extract key points and create comprehensive summaries</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Legal Simplification</h3>
              <p>Convert complex legal language into plain, understandable text</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>Entity Extraction</h3>
              <p>Identify parties, dates, obligations, and key legal entities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Side-by-Side Comparison</h3>
              <p>Compare original and simplified versions for better understanding</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Document History</h3>
              <p>Store and manage your processed documents in MongoDB</p>
            </div>
          </div>
        </div>

        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Document</h3>
                <p>Drag and drop your legal document or select from test documents</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Processing</h3>
                <p>Our system extracts text, identifies entities, and creates summaries</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Review Results</h3>
                <p>Compare original vs simplified text and explore extracted entities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>About Our Technology</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Our Legal Document Summarizer leverages cutting-edge AI technology to analyze and simplify complex legal documents. 
                Built with advanced natural language processing algorithms, our system can understand legal terminology, 
                identify key clauses, and present information in plain language.
              </p>
              <p>
                Whether you're a lawyer reviewing contracts, a business owner understanding agreements, 
                or a student learning legal concepts, our platform makes legal documents accessible to everyone.
              </p>
            </div>
            <div className="tech-stack">
              <h3>Powered By</h3>
              <div className="tech-items">
                <div className="tech-item">🤖 AI & Machine Learning</div>
                <div className="tech-item">📝 Natural Language Processing</div>
                <div className="tech-item">⚡ Real-time Processing</div>
                <div className="tech-item">🔒 Secure & Private</div>
              </div>
            </div>
          </div>
        </div>

        <div className="use-cases-section">
          <h2>Perfect For</h2>
          <div className="use-cases-grid">
            <div className="use-case-card">
              <div className="use-case-icon">⚖️</div>
              <h3>Legal Professionals</h3>
              <p>Quickly review and analyze contracts, agreements, and legal documents</p>
            </div>
            <div className="use-case-card">
              <div className="use-case-icon">🏢</div>
              <h3>Business Owners</h3>
              <p>Understand complex business agreements and legal obligations</p>
            </div>
            <div className="use-case-card">
              <div className="use-case-icon">🎓</div>
              <h3>Students & Researchers</h3>
              <p>Learn legal concepts through simplified document analysis</p>
            </div>
            <div className="use-case-card">
              <div className="use-case-icon">👥</div>
              <h3>General Public</h3>
              <p>Make sense of legal documents in everyday life situations</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Simplify Your Legal Documents?</h2>
          <p>Join thousands of users who trust our AI-powered legal document analysis</p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={handleSignUp}>
              Sign Up Now
            </button>
            <button className="cta-button secondary" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
          <p className="cta-note">Free to get started • No credit card required</p>
        </div>
      </div>
    </div>
  )
}
