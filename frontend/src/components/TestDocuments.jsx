import React from 'react'

const TEST_DOCUMENTS = [
  {
    name: 'Employment Contract',
    filename: 'employment_contract.txt',
    description: 'Complex employment agreement with salary, benefits, non-compete clauses'
  },
  {
    name: 'Lease Agreement', 
    filename: 'lease_agreement.txt',
    description: 'Residential lease with rent, security deposit, and tenant obligations'
  },
  {
    name: 'Service Agreement',
    filename: 'service_agreement.txt', 
    description: 'Professional services contract with performance metrics and payment terms'
  },
  {
    name: 'Purchase Agreement',
    filename: 'purchase_agreement.txt',
    description: 'Asset purchase agreement with complex financial terms and representations'
  },
  {
    name: 'NDA Agreement',
    filename: 'nda_agreement.txt',
    description: 'Mutual non-disclosure agreement with confidentiality obligations'
  },
  {
    name: 'Simple Contract',
    filename: 'simple_contract.txt',
    description: 'Simple freelance contract in plain language (good for comparison)'
  }
]

export default function TestDocuments({ onDocumentSelected, disabled }) {
  const handleSelectDocument = async (doc) => {
    if (disabled) return
    
    try {
      // Fetch the document content from the test-documents folder
      const response = await fetch(`/test-documents/${doc.filename}`)
      if (!response.ok) {
        throw new Error('Failed to load test document')
      }
      
      const content = await response.text()
      
      // Create a File object from the content
      const file = new File([content], doc.filename, {
        type: 'text/plain',
        lastModified: Date.now()
      })
      
      onDocumentSelected(file)
    } catch (error) {
      console.error('Error loading test document:', error)
      alert('Failed to load test document. Please try uploading your own file.')
    }
  }

  return (
    <div className="card">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: '700' }}>
          📋 Try Sample Documents
        </h3>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
          Test our AI with these pre-loaded legal documents to see how it works
        </p>
      </div>
      <div className="test-docs-grid">
        {TEST_DOCUMENTS.map((doc, index) => (
          <button
            key={doc.filename}
            className={`test-doc-item animate-fade-in-up stagger-${(index % 6) + 1}`}
            onClick={() => handleSelectDocument(doc)}
            disabled={disabled}
            title={doc.description}
          >
            <div className="test-doc-content">
              <div className="test-doc-name">{doc.name}</div>
              <div className="test-doc-desc">{doc.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}