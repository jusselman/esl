import { Routes, Route, useSearchParams } from 'react-router-dom'
import StartScreen from './views/StartScreen'
import ActivityMenu from './views/ActivityMenu'
import HostLobby from './views/HostLobby'
import StudentJoin from './views/StudentJoin'

// ?view=student&room=1234  => student flow
// Everything else => host flow

export default function App() {
  const [params] = useSearchParams()
  const isStudent = params.get('view') === 'student'

  if (isStudent) {
    return (
      <Routes>
        <Route path="*" element={<StudentJoin />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/menu" element={<ActivityMenu />} />
      <Route path="/host/debate" element={<HostLobby />} />
    </Routes>
  )
}
