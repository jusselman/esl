import React from 'react'

/**
 * PerspectiveCard Component
 * Displays a perspective (viewpoint) from a reading comprehension topic
 * Can be tapped to expand and show full viewpoint text
 */
export default function PerspectiveCard({ perspective, onTap, tapped, expanded }) {
  return (
    <div
      style={{
        background: perspective.color + '15',
        border: `2px solid ${tapped ? perspective.color : '#e0e0e0'}`,
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: tapped ? 1 : 0.7,
        transform: tapped ? 'scale(1.02)' : 'scale(1)',
      }}
      onClick={onTap}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: expanded ? '12px' : '0'
      }}>
        <div style={{
          fontSize: '28px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {perspective.icon}
        </div>
        <div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#333'
          }}>
            {perspective.name}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#666'
          }}>
            {perspective.title}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{
          fontSize: '14px',
          color: '#333',
          lineHeight: '1.6',
          marginTop: '12px',
          padding: '12px',
          background: 'white',
          borderRadius: '8px'
        }}>
          {perspective.viewpoint}
        </div>
      )}

      <div style={{
        fontSize: '12px',
        color: tapped ? perspective.color : '#ccc',
        marginTop: expanded ? '12px' : '0',
        textAlign: 'center',
        fontWeight: '600'
      }}>
        {tapped ? '✓ Read' : 'Tap to read'}
      </div>
    </div>
  )
}
