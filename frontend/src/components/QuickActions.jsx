import React, { useState } from 'react'

export default function QuickActions({ document, entities = [], onAction }) {
  const [selectedAction, setSelectedAction] = useState(null)

  const quickActions = [
    {
      id: 'key-terms',
      title: 'Extract Key Terms',
      icon: '🔑',
      description: 'Identify the most important legal terms',
      action: () => extractKeyTerms()
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      icon: '⚠️',
      description: 'Analyze potential legal risks',
      action: () => performRiskAssessment()
    },
    {
      id: 'deadline-tracker',
      title: 'Find Deadlines',
      icon: '📅',
      description: 'Extract important dates and deadlines',
      action: () => extractDeadlines()
    },
    {
      id: 'party-analysis',
      title: 'Party Analysis',
      icon: '👥',
      description: 'Identify all parties and their roles',
      action: () => analyzeParties()
    },
    {
      id: 'obligation-finder',
      title: 'Find Obligations',
      icon: '📋',
      description: 'Extract obligations and responsibilities',
      action: () => findObligations()
    },
    {
      id: 'compliance-check',
      title: 'Compliance Check',
      icon: '✅',
      description: 'Check for compliance requirements',
      action: () => checkCompliance()
    }
  ]

  const extractKeyTerms = () => {
    if (!document?.originalText) return

    const text = document.originalText.toLowerCase()
    const legalTerms = [
      'agreement', 'contract', 'party', 'parties', 'obligation', 'liability',
      'breach', 'termination', 'confidential', 'proprietary', 'indemnify',
      'damages', 'penalty', 'jurisdiction', 'governing law', 'arbitration'
    ]

    const foundTerms = legalTerms.filter(term => text.includes(term))
    
    setSelectedAction({
      type: 'key-terms',
      title: 'Key Legal Terms Found',
      results: foundTerms.map(term => ({
        term,
        count: (text.match(new RegExp(term, 'g')) || []).length
      })).sort((a, b) => b.count - a.count)
    })
  }

  const performRiskAssessment = () => {
    if (!document?.originalText) return

    const text = document.originalText.toLowerCase()
    const riskIndicators = [
      { term: 'penalty', level: 'high', description: 'Financial penalties mentioned' },
      { term: 'liability', level: 'high', description: 'Liability clauses present' },
      { term: 'breach', level: 'medium', description: 'Breach conditions specified' },
      { term: 'termination', level: 'medium', description: 'Termination clauses found' },
      { term: 'dispute', level: 'medium', description: 'Dispute resolution mentioned' },
      { term: 'confidential', level: 'low', description: 'Confidentiality requirements' }
    ]

    const risks = riskIndicators
      .filter(risk => text.includes(risk.term))
      .map(risk => ({
        ...risk,
        count: (text.match(new RegExp(risk.term, 'g')) || []).length
      }))

    setSelectedAction({
      type: 'risk-assessment',
      title: 'Risk Assessment Results',
      results: risks
    })
  }

  const extractDeadlines = () => {
    const dateEntities = entities.filter(e => 
      e.type === 'date' || e.type === 'time'
    )

    const deadlineKeywords = ['deadline', 'due', 'expire', 'within', 'before', 'after']
    const text = document?.originalText || ''
    
    const potentialDeadlines = dateEntities.map(entity => {
      const context = extractContext(text, entity.value)
      const hasDeadlineKeyword = deadlineKeywords.some(keyword => 
        context.toLowerCase().includes(keyword)
      )
      
      return {
        date: entity.value,
        context: context.substring(0, 100) + '...',
        priority: hasDeadlineKeyword ? 'high' : 'medium'
      }
    })

    setSelectedAction({
      type: 'deadlines',
      title: 'Important Dates & Deadlines',
      results: potentialDeadlines
    })
  }

  const analyzeParties = () => {
    const parties = entities.filter(e => 
      e.type === 'person' || e.type === 'organization'
    )

    const partyAnalysis = parties.map(party => {
      const context = extractContext(document?.originalText || '', party.value)
      const role = determineRole(context, party.value)
      
      return {
        name: party.value,
        type: party.type,
        role,
        context: context.substring(0, 150) + '...'
      }
    })

    setSelectedAction({
      type: 'parties',
      title: 'Party Analysis',
      results: partyAnalysis
    })
  }

  const findObligations = () => {
    const text = document?.originalText || ''
    const obligationKeywords = [
      'shall', 'must', 'required to', 'obligated to', 'responsible for',
      'agrees to', 'undertakes to', 'commits to'
    ]

    const obligations = []
    obligationKeywords.forEach(keyword => {
      const regex = new RegExp(`[^.]*${keyword}[^.]*\\.`, 'gi')
      const matches = text.match(regex) || []
      matches.forEach(match => {
        obligations.push({
          keyword,
          text: match.trim(),
          type: 'obligation'
        })
      })
    })

    setSelectedAction({
      type: 'obligations',
      title: 'Obligations & Responsibilities',
      results: obligations.slice(0, 10) // Limit to first 10
    })
  }

  const checkCompliance = () => {
    const text = document?.originalText?.toLowerCase() || ''
    const complianceAreas = [
      { area: 'GDPR', keywords: ['gdpr', 'data protection', 'personal data'], required: true },
      { area: 'Employment Law', keywords: ['employment', 'worker', 'employee'], required: false },
      { area: 'Contract Law', keywords: ['contract', 'agreement', 'terms'], required: true },
      { area: 'Intellectual Property', keywords: ['copyright', 'trademark', 'patent', 'ip'], required: false },
      { area: 'Dispute Resolution', keywords: ['arbitration', 'mediation', 'court'], required: true }
    ]

    const compliance = complianceAreas.map(area => {
      const found = area.keywords.some(keyword => text.includes(keyword))
      return {
        area: area.area,
        status: found ? 'compliant' : 'needs-review',
        required: area.required,
        keywords: area.keywords.filter(k => text.includes(k))
      }
    })

    setSelectedAction({
      type: 'compliance',
      title: 'Compliance Check Results',
      results: compliance
    })
  }

  const extractContext = (text, term) => {
    const index = text.toLowerCase().indexOf(term.toLowerCase())
    if (index === -1) return ''
    
    const start = Math.max(0, index - 50)
    const end = Math.min(text.length, index + term.length + 50)
    return text.substring(start, end)
  }

  const determineRole = (context, partyName) => {
    const lowerContext = context.toLowerCase()
    if (lowerContext.includes('company') || lowerContext.includes('corporation')) {
      return 'Company/Organization'
    }
    if (lowerContext.includes('employee') || lowerContext.includes('worker')) {
      return 'Employee'
    }
    if (lowerContext.includes('client') || lowerContext.includes('customer')) {
      return 'Client'
    }
    if (lowerContext.includes('contractor') || lowerContext.includes('vendor')) {
      return 'Contractor/Vendor'
    }
    return 'Party'
  }

  if (!document) {
    return (
      <div className="quick-actions-container">
        <div className="quick-actions-header">
          <h3>⚡ Quick Actions</h3>
          <p>Process a document to enable quick analysis tools</p>
        </div>
        <div className="quick-actions-empty">
          <p>No document available for analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-header">
        <h3>⚡ Quick Actions</h3>
        <p>Powerful tools for instant document analysis</p>
      </div>

      <div className="actions-grid">
        {quickActions.map(action => (
          <button
            key={action.id}
            className="action-card"
            onClick={action.action}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h4>{action.title}</h4>
              <p>{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedAction && (
        <div className="action-results">
          <div className="results-header">
            <h4>{selectedAction.title}</h4>
            <button 
              className="close-btn"
              onClick={() => setSelectedAction(null)}
            >
              ×
            </button>
          </div>
          
          <div className="results-content">
            {selectedAction.type === 'key-terms' && (
              <div className="key-terms-results">
                {selectedAction.results.map((term, index) => (
                  <div key={index} className="term-item">
                    <span className="term-name">{term.term}</span>
                    <span className="term-count">{term.count} times</span>
                  </div>
                ))}
              </div>
            )}

            {selectedAction.type === 'risk-assessment' && (
              <div className="risk-results">
                {selectedAction.results.map((risk, index) => (
                  <div key={index} className={`risk-item ${risk.level}`}>
                    <div className="risk-level">{risk.level.toUpperCase()}</div>
                    <div className="risk-description">{risk.description}</div>
                    <div className="risk-count">Found {risk.count} times</div>
                  </div>
                ))}
              </div>
            )}

            {selectedAction.type === 'deadlines' && (
              <div className="deadline-results">
                {selectedAction.results.map((deadline, index) => (
                  <div key={index} className={`deadline-item ${deadline.priority}`}>
                    <div className="deadline-date">{deadline.date}</div>
                    <div className="deadline-context">{deadline.context}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedAction.type === 'parties' && (
              <div className="party-results">
                {selectedAction.results.map((party, index) => (
                  <div key={index} className="party-item">
                    <div className="party-name">{party.name}</div>
                    <div className="party-role">{party.role}</div>
                    <div className="party-context">{party.context}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedAction.type === 'obligations' && (
              <div className="obligation-results">
                {selectedAction.results.map((obligation, index) => (
                  <div key={index} className="obligation-item">
                    <div className="obligation-keyword">{obligation.keyword}</div>
                    <div className="obligation-text">{obligation.text}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedAction.type === 'compliance' && (
              <div className="compliance-results">
                {selectedAction.results.map((item, index) => (
                  <div key={index} className={`compliance-item ${item.status}`}>
                    <div className="compliance-area">{item.area}</div>
                    <div className="compliance-status">
                      {item.status === 'compliant' ? '✅ Compliant' : '⚠️ Needs Review'}
                    </div>
                    {item.required && (
                      <div className="compliance-required">Required</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}