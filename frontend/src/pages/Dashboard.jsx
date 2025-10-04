import React, { useEffect, useMemo, useState } from 'react'
import Dropzone from '../components/Dropzone.jsx'
import ComparisonView from '../components/ComparisonView.jsx'
import EntityList from '../components/EntityList.jsx'
import HistoryList from '../components/HistoryList.jsx'
import TestDocuments from '../components/TestDocuments.jsx'
import { uploadDocument, processDocument, getDocument, listDocuments, deleteDocument } from '../api/client.js'

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [doc, setDoc] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

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
    <div className="container">
      <div className="header">
        <h2>Legal Document Summarizer</h2>
        <div className="badge">{status}</div>
      </div>

      <div className="grid">
        <div className="card">
          <Dropzone onFileSelected={onFileSelected} disabled={disableUpload} />
          <div className="muted" style={{marginTop:8}}>{message}</div>
        </div>
        <HistoryList items={history} onSelect={(id)=>setSelectedId(id)} onDelete={handleDeleteDocument} />
      </div>

      <div style={{height:16}} />

      <TestDocuments onDocumentSelected={onFileSelected} disabled={disableUpload} />

      <div style={{height:16}} />

      <ComparisonView original={doc?.originalText} simplified={doc?.simplifiedText} />

      <div style={{height:16}} />

      <EntityList entities={doc?.entities || []} />
    </div>
  )
}
