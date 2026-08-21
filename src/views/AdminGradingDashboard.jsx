import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResponsesForRoom, getGradingsForRoom, submitGrading, AVATARS } from '../store/gameStore'
import GradingRubric from '../components/GradingRubric'
import styles from './AdminGradingDashboard.module.css'

/**
 * AdminGradingDashboard
 * Teacher's grading interface for reading comprehension responses
 *
 * Flow:
 * 1. List all students who submitted (left panel)
 * 2. Display student response (center/top)
 * 3. Show grading rubric form (center/bottom)
 * 4. Save grades to Supabase
 */
export default function AdminGradingDashboard() {
  const { roomCode } = useParams()
  const navigate = useNavigate()

  const [responses, setResponses] = useState([])
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [gradings, setGradings] = useState([])
  const [loadingStudentId, setLoadingStudentId] = useState(null)

  useEffect(() => {
    if (!roomCode) return

    // Load all responses
    getResponsesForRoom(roomCode).then(data => {
      setResponses(data || [])
      if (data && data.length > 0) {
        setSelectedResponse(data[0])
      }
    })

    // Load all existing gradings
    getGradingsForRoom(roomCode).then(setGradings)
  }, [roomCode])

  const avatarMap = Object.fromEntries(AVATARS.map(a => [a.id, a]))

  const selectedGrading = selectedResponse
    ? gradings.find(g => g.student_id === selectedResponse.student_id)
    : null

  const handleSelectResponse = (response) => {
    setSelectedResponse(response)
  }

  const handleSubmitGrade = async (grades) => {
    if (!selectedResponse) return

    setLoadingStudentId(selectedResponse.student_id)
    try {
      await submitGrading(roomCode, selectedResponse.student_id, grades)

      // Update local gradings
      const updatedGradings = gradings.filter(g => g.student_id !== selectedResponse.student_id)
      updatedGradings.push({
        student_id: selectedResponse.student_id,
        ...grades
      })
      setGradings(updatedGradings)

      // Move to next ungraded student
      const nextUngraded = responses.find(
        r => !updatedGradings.some(g => g.student_id === r.student_id)
      )
      if (nextUngraded) {
        setSelectedResponse(nextUngraded)
      }
    } catch (error) {
      console.error('Error submitting grade:', error)
      alert('Error saving grade. Please try again.')
    } finally {
      setLoadingStudentId(null)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(`/reading-comprehension/host?room=${roomCode}`)}>
          ← Back
        </button>
        <h1 className={styles.title}>Grade Responses</h1>
        <div className={styles.progress}>
          {gradings.length} of {responses.length} graded
        </div>
      </div>

      <div className={styles.body}>
        {/* Left: Student List */}
        <div className={styles.studentList}>
          <h3 className={styles.studentListTitle}>Submissions</h3>
          <div className={styles.studentItems}>
            {responses.map(response => {
              const graded = gradings.some(g => g.student_id === response.student_id)
              const isSelected = selectedResponse?.student_id === response.student_id

              return (
                <button
                  key={response.student_id}
                  className={`${styles.studentItem} ${isSelected ? styles.studentItem_selected : ''} ${graded ? styles.studentItem_graded : ''}`}
                  onClick={() => handleSelectResponse(response)}
                >
                  <div className={styles.studentAvatar}>
                    <span>{response.student_name.charAt(0)}</span>
                  </div>
                  <div className={styles.studentInfo}>
                    <div className={styles.studentName}>{response.student_name}</div>
                    {graded && <div className={styles.gradedBadge}>✓ Graded</div>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Response + Grading */}
        <div className={styles.gradingPanel}>
          {selectedResponse ? (
            <>
              {/* Response Display */}
              <div className={styles.responseSection}>
                <h3 className={styles.responseTitle}>Response</h3>
                <div className={styles.responseBox}>
                  <p className={styles.responseText}>{selectedResponse.response_text}</p>
                  <div className={styles.responseStats}>
                    <span className={styles.wordCount}>
                      {selectedResponse.word_count} words
                    </span>
                  </div>
                </div>
              </div>

              {/* Grading Rubric */}
              <div className={styles.rubricSection}>
                <GradingRubric
                  onSubmitGrade={handleSubmitGrade}
                  initialGrade={selectedGrading}
                />
              </div>

              {loadingStudentId === selectedResponse.student_id && (
                <div className={styles.loadingOverlay}>Saving...</div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a student to grade their response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
