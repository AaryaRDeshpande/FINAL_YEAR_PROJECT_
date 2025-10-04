import React, { useCallback, useRef, useState } from 'react'

export default function Dropzone({ onFileSelected, disabled }) {
  const [isOver, setIsOver] = useState(false)
  const inputRef = useRef(null)

  const onDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOver(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelected(file)
  }, [onFileSelected, disabled])

  const onBrowse = () => {
    if (!disabled) inputRef.current?.click()
  }

  const onChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelected(file)
  }

  return (
    <div
      className={`dropzone ${isOver ? 'over' : ''} ${disabled ? 'disabled' : ''}`}
      onDragOver={(e)=>{e.preventDefault(); if (!disabled) setIsOver(true)}}
      onDragLeave={()=>setIsOver(false)}
      onDrop={onDrop}
      onClick={onBrowse}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        style={{ display: 'none' }}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="dropzone-icon">📁</div>
      <p className="dropzone-text">
        <strong>Drag & drop</strong> a PDF, DOCX or TXT here, or <span className="browse-link">click to browse</span>
      </p>
      <p className="muted">Max 15MB • Supports PDF, DOCX, TXT formats</p>
    </div>
  )
}
