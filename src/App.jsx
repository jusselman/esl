import React from 'react'
import { Routes, Route, useSearchParams } from 'react-router-dom'
import StartScreen from './views/StartScreen'
import ActivityMenu from './views/ActivityMenu'
import HostLobby from './views/HostLobby'
import StudentJoin from './views/StudentJoin'
import ReadingComprehensionSetup from './views/ReadingComprehensionSetup'
import ReadingComprehensionHost from './views/ReadingComprehensionHost'
import ReadingComprehensionStudent from './views/ReadingComprehensionStudent'
import AdminGradingDashboard from './views/AdminGradingDashboard'
import GrammarDuelSetup from './views/GrammarDuelSetup'
import GrammarDuelHost from './views/GrammarDuelHost'
import GrammarDuelStudent from './views/GrammarDuelStudent'

// ?view=student&room=1234  => student flow
// Everything else => host flow

export default function App() {
  const [params] = useSearchParams()
  const isStudent = params.get('view') === 'student'

  if (isStudent) {
    return (
      <Routes>
        <Route path="/reading-comprehension" element={<ReadingComprehensionStudent />} />
        <Route path="/grammar-duel" element={<GrammarDuelStudent />} />
        <Route path="*" element={<StudentJoin />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/menu" element={<ActivityMenu />} />
      <Route path="/host/debate" element={<HostLobby />} />
      <Route path="/host/reading-comprehension" element={<ReadingComprehensionSetup />} />
      <Route path="/reading-comprehension/host" element={<ReadingComprehensionHost />} />
      <Route path="/admin/grading/:roomCode" element={<AdminGradingDashboard />} />
      <Route path="/host/grammar-duel" element={<GrammarDuelSetup />} />
      <Route path="/grammar-duel/host" element={<GrammarDuelHost />} />
    </Routes>
  )
}
