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
import VocabularyBuilderMenu from './views/VocabularyBuilderMenu'
import WordBuilderSetup from './views/WordBuilderSetup'
import WordBuilderHost from './views/WordBuilderHost'
import WordBuilderStudent from './views/WordBuilderStudent'
import SynonymsSetup from './views/SynonymsSetup'
import SynonymsHost from './views/SynonymsHost'
import SynonymsStudent from './views/SynonymsStudent'
import FillItInSetup from './views/FillItInSetup'
import FillItInHost from './views/FillItInHost'
import FillItInStudent from './views/FillItInStudent'
import StoryTimeMenu from './views/StoryTimeMenu'
import ListenRecallSetup from './views/ListenRecallSetup'
import ListenRecallHost from './views/ListenRecallHost'
import ListenRecallStudent from './views/ListenRecallStudent'

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
        <Route path="/word-builder" element={<WordBuilderStudent />} />
        <Route path="/synonyms" element={<SynonymsStudent />} />
        <Route path="/fill-it-in" element={<FillItInStudent />} />
        <Route path="/listen-recall" element={<ListenRecallStudent />} />
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
      <Route path="/vocabulary-builder" element={<VocabularyBuilderMenu />} />
      <Route path="/host/word-builder" element={<WordBuilderSetup />} />
      <Route path="/word-builder/host" element={<WordBuilderHost />} />
      <Route path="/host/synonyms" element={<SynonymsSetup />} />
      <Route path="/synonyms/host" element={<SynonymsHost />} />
      <Route path="/host/fill-it-in" element={<FillItInSetup />} />
      <Route path="/fill-it-in/host" element={<FillItInHost />} />
      <Route path="/story-time" element={<StoryTimeMenu />} />
      <Route path="/host/listen-recall" element={<ListenRecallSetup />} />
      <Route path="/listen-recall/host" element={<ListenRecallHost />} />
    </Routes>
  )
}
