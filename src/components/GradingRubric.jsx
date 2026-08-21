import React, { useState, useEffect } from 'react'

/**
 * GradingRubric Component
 * Rubric form for grading reading comprehension responses
 * 4 categories: Development, Syntax, Conventions, Accuracy
 * Each category: 0-25 points with optional feedback
 */
export default function GradingRubric({ onSubmitGrade, initialGrade }) {
  const [scores, setScores] = useState({
    development: 0,
    syntax: 0,
    conventions: 0,
    accuracy: 0,
  })

  const [feedback, setFeedback] = useState({
    development: '',
    syntax: '',
    conventions: '',
    accuracy: '',
  })

  useEffect(() => {
    if (initialGrade?.rubric_scores) {
      setScores(initialGrade.rubric_scores)
      setFeedback(initialGrade.feedback || {})
    } else {
      setScores({
        development: 0,
        syntax: 0,
        conventions: 0,
        accuracy: 0,
      })
      setFeedback({
        development: '',
        syntax: '',
        conventions: '',
        accuracy: '',
      })
    }
  }, [initialGrade])

  const totalScore = Object.values(scores).reduce((sum, score) => sum + (parseInt(score) || 0), 0)

  const handleScoreChange = (category, value) => {
    setScores(prev => ({
      ...prev,
      [category]: Math.min(25, Math.max(0, parseInt(value) || 0))
    }))
  }

  const handleFeedbackChange = (category, value) => {
    setFeedback(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSubmit = () => {
    onSubmitGrade({ rubric_scores: scores, feedback })
  }

  const categories = [
    { key: 'development', label: 'Idea Development & Support' },
    { key: 'syntax', label: 'Sentence Structure & Grammar' },
    { key: 'conventions', label: 'Writing Conventions' },
    { key: 'accuracy', label: 'Vocabulary & Accuracy' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', margin: 0 }}>Rubric</h3>
      </div>

      {categories.map(cat => (
        <div key={cat.key} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px',
          background: '#f8f8f8',
          borderRadius: '8px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', flex: 1 }}>
              {cat.label}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                min="0"
                max="25"
                value={scores[cat.key]}
                onChange={(e) => handleScoreChange(cat.key, e.target.value)}
                style={{
                  width: '50px',
                  padding: '6px 8px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              />
              <span style={{ fontSize: '13px', color: '#999', fontWeight: '600' }}>/ 25</span>
            </div>
          </div>

          <textarea
            value={feedback[cat.key] || ''}
            onChange={(e) => handleFeedbackChange(cat.key, e.target.value)}
            placeholder="Optional feedback..."
            style={{
              padding: '8px 12px',
              border: '1px solid #d0d0d0',
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
              resize: 'vertical',
              minHeight: '60px',
            }}
          />
        </div>
      ))}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: '#f0f8f7',
        borderRadius: '8px',
        border: '2px solid #2EC4A9',
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#333',
        }}>
          Total: <span style={{ color: '#2EC4A9', fontSize: '18px' }}>{totalScore}</span> / 100
        </div>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          background: '#2EC4A9',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        Save Grade
      </button>
    </div>
  )
}
