export default function ResultCard({ data }) {
  const { analysis, fda_data } = data

  const severityColor = {
    mild: '#4ade80',
    moderate: '#facc15',
    severe: '#f87171',
    'life-threatening': '#ef4444',
    unknown: '#9ca3af'
  }

  const confidence = analysis.confidence_score != null
    ? Math.round(analysis.confidence_score * 100)
    : null

  const confidenceBarColor =
    confidence >= 80 ? '#4ade80' :
    confidence >= 50 ? '#facc15' : '#f87171'

  const Field = ({ label, value }) => {
    if (!value) return null
    return (
      <div style={{
        display: 'flex',
        gap: '12px',
        fontSize: '13px',
        padding: '8px 0',
        borderBottom: '1px solid #2a2a2a'
      }}>
        <span style={{ color: '#6b7280', minWidth: '130px', flexShrink: 0 }}>{label}</span>
        <span style={{ color: '#e5e7eb' }}>{value}</span>
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '24px',
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '20px',
      color: '#e5e7eb'
    }}>

      {/* Header */}
      <p style={{
        fontSize: '11px',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #2a2a2a'
      }}>
        Analysis Result
      </p>

      {/* Metric cards row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '16px'
      }}>
        {/* Severity */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Severity</p>
          <p style={{
            fontSize: '15px',
            fontWeight: '600',
            color: severityColor[analysis.severity?.toLowerCase()] || '#e5e7eb'
          }}>
            {analysis.severity
              ? analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)
              : '—'}
          </p>
        </div>

        {/* WHO Causality */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>WHO Causality</p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#e5e7eb' }}>
            {analysis.who_causality || '—'}
          </p>
        </div>

        {/* Confidence */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Confidence</p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#e5e7eb' }}>
            {confidence !== null ? `${confidence}%` : '—'}
          </p>
          {confidence !== null && (
            <div style={{
              height: '4px',
              borderRadius: '2px',
              background: '#2a2a2a',
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${confidence}%`,
                background: confidenceBarColor,
                borderRadius: '2px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          )}
        </div>
      </div>

      {/* Detail fields */}
      <div style={{ marginBottom: '16px' }}>
        <Field label="Drugs found" value={analysis.drugs?.join(', ')} />
        <Field label="Adverse events" value={analysis.adverse_events?.join(', ')} />
        <Field label="Patient age" value={analysis.patient_age} />
        <Field label="Duration" value={analysis.duration} />
        <Field label="Severity reason" value={analysis.severity_reason} />
        <Field label="Causality reason" value={analysis.causality_reason} />
        <Field label="Action required" value={analysis.action_required} />
      </div>

      {/* FDA FAERS section */}
      {fda_data?.length > 0 && (
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '14px'
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>
            FDA FAERS — Known Reactions
          </p>
          {fda_data.map((d, i) => (
            <div key={i} style={{
              fontSize: '12px',
              color: '#9ca3af',
              padding: '5px 0',
              borderBottom: i < fda_data.length - 1 ? '1px solid #2a2a2a' : 'none'
            }}>
              <span style={{ color: '#e5e7eb', fontWeight: '500' }}>{d.drug}</span>
              {' — '}
              {d.fda_common_reactions?.length > 0
                ? d.fda_common_reactions.join(', ').toLowerCase()
                : 'no data found'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}