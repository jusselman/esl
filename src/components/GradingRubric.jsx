import React, { useState, useEffect } from 'react'
import styles from './GradingRubric.module.css'

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
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <h3 className={styles.headerTitle}>Rubric</h3>
      </div>

      {categories.map(cat => (
        <div key={cat.key} className={styles.category}>
          <div className={styles.categoryTop}>
            <label className={styles.categoryLabel}>{cat.label}</label>
            <div className={styles.scoreGroup}>
              <input
                type="number"
                min="0"
                max="25"
                value={scores[cat.key]}
                onChange={(e) => handleScoreChange(cat.key, e.target.value)}
                className={styles.scoreInput}
              />
              <span className={styles.scoreMax}>/ 25</span>
            </div>
          </div>

          <textarea
            value={feedback[cat.key] || ''}
            onChange={(e) => handleFeedbackChange(cat.key, e.target.value)}
            placeholder="Optional feedback..."
            className={styles.feedbackInput}
          />
        </div>
      ))}

      <div className={styles.totalBox}>
        <div className={styles.totalLabel}>
          Total: <span className={styles.totalValue}>{totalScore}</span> / 100
        </div>
      </div>

      <button onClick={handleSubmit} className={styles.saveBtn}>
        Save Grade
      </button>
    </div>
  )
}
