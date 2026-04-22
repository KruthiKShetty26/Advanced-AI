import { useState } from 'react'
import axios from 'axios'
import ResultCard from './ResultCard'

export default function Analyzer() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await axios.post('http://localhost:8000/analyze', { text })
      setResult(res.data)
    } catch (e) {
      setError('Analysis failed. Make sure your backend is running: uvicorn main:app --reload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <textarea
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid #2a2a2a',
          fontSize: '14px',
          background: '#111111',
          color: '#e5e7eb',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: '1.6',
          fontFamily: 'system-ui, sans-serif'
        }}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste any text containing drug information — patient report, news article, Reddit post, medical note..."
        rows={6}
        onFocus={e => e.target.style.border = '1px solid #4b5563'}
        onBlur={e => e.target.style.border = '1px solid #2a2a2a'}
      />

      <button
        onClick={analyze}
        disabled={loading || !text.trim()}
        style={{
          width: '100%',
          marginTop: '12px',
          padding: '14px',
          background: loading || !text.trim() ? '#1a2e1a' : '#16a34a',
          color: loading || !text.trim() ? '#4b7a4b' : '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '14px',
          cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          letterSpacing: '0.02em'
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Report'}
      </button>

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#1f0000',
          border: '1px solid #7f1d1d',
          borderRadius: '8px',
          color: '#fca5a5',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      {result && <ResultCard data={result} />}
    </div>
  )
}