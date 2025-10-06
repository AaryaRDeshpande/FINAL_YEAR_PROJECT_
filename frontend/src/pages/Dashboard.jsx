import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropzone from '../components/Dropzone.jsx'
import ComparisonView from '../components/ComparisonView.jsx'
import EntityList from '../components/EntityList.jsx'
import HistoryList from '../components/HistoryList.jsx'
import TestDocuments from '../components/TestDocuments.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import KnowledgeGraph from '../components/KnowledgeGraph.jsx'
import { uploadDocument, processDocument, getDocument, listDocuments, deleteDocument } from '../api/client.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [doc, setDoc] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/login')
    }
  }, [navigate])

  const refreshHistory = async () => {
    const items = await listDocuments()
    setHistory(items)
  }

  useEffect(() => { refreshHistory() }, [])

  useEffect(() => {
    if (!selectedId) return
    getDocument(selectedId).then(setDoc)
  }, [selectedId])

  const onFileSelected = async (file) => {
    try {
      setStatus('uploading')
      setMessage('Uploading file...')
      const created = await uploadDocument(file)
      setSelectedId(created._id)
      setDoc(created)
      setMessage('Processing document...')
      setStatus('processing')
      const processed = await processDocument(created._id)
      setDoc(processed)
      setMessage('Done')
      setStatus('done')
      await refreshHistory()
    } catch (e) {
      console.error(e)
      setMessage(e?.response?.data?.message || e.message || 'Error')
      setStatus('error')
    }
  }

  const disableUpload = useMemo(() => status === 'uploading' || status === 'processing', [status])

  const handleDeleteDocument = async (id) => {
    try {
      await deleteDocument(id)
      // If the deleted document was selected, clear the selection
      if (selectedId === id) {
        setSelectedId(null)
        setDoc(null)
      }
      await refreshHistory()
      setMessage('Document deleted successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      console.error(e)
      setMessage(e?.response?.data?.message || 'Error deleting document')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="btn secondary" 
              onClick={() => navigate('/')}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              ← Back to Home
            </button>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>Legal Document Summarizer</h2>
          </div>
          <div className="badge">{status}</div>
        </div>

        <div className="grid">
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: '600' }}>Upload Document</h3>
            <Dropzone onFileSelected={onFileSelected} disabled={disableUpload} />
            {(status === 'uploading' || status === 'processing') && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner 
                  size="medium" 
                  text={status === 'uploading' ? 'Uploading...' : 'Processing...'}
                />
              </div>
            )}
            {message && (
              <div className={`status-message ${status === 'error' ? 'error' : ''}`} style={{marginTop: 16}}>
                {message}
              </div>
            )}
          </div>
          <HistoryList items={history} onSelect={(id)=>setSelectedId(id)} onDelete={handleDeleteDocument} />
        </div>

        <div style={{height: 32}} />

        <TestDocuments onDocumentSelected={onFileSelected} disabled={disableUpload} />

        <div style={{height: 32}} />

        <KnowledgeGraph document={doc} entities={doc?.entities || []} />

        <div style={{height: 32}} />

        <ComparisonView original={doc?.originalText} simplified={doc?.simplifiedText} />

        <div style={{height: 32}} />

        <EntityList entities={doc?.entities || []} />
      </div>
    </div>
  )
}
