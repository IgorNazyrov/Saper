import './App.css'
import { Routes, Route } from 'react-router-dom'
import GameSettings from './components/GameSettings/GameSettings'
import LeaderBoard from './pages/LeaderBoard/LeaderBoard'
import Game from './pages/Game/Game'
import { DifficultyProvider } from './components/DifficultyContext'

function App() {


  return (
    <>
    <DifficultyProvider>
      <Routes>
        <Route path='/' element={<Game/>}/>
        <Route path='/leaderboard' element={<LeaderBoard/>}/>
        {/* <Route path='/game' element={<Game/>}/> */}
      </Routes>
    </DifficultyProvider>
    </>
  )
}

export default App
