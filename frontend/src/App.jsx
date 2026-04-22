import { useState } from 'react'
import Analyzer from './Analyzer'
import History from './History'

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#e5e7eb',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '500',
            color: '#f9fafb',
            marginBottom: '4px'
          }}>
            Drug safety signal detector
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>AI-powered pharmacovigilance</p>

          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
            {['analyze', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '6px',
                  border: '1px solid #2a2a2a',
                  background: activeTab === tab ? '#1d4ed8' : '#111111',
                  color: activeTab === tab ? '#ffffff' : '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'analyze' ? 'Analyze report' : 'History'}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        {activeTab === 'analyze' ? <Analyzer /> : <History />}
      </div>
    </div>
  )
}