import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
//import './App.css'
import FaceExpression from "./components/FacialExpression"
import MoodSongs from './components/MoodSongs'


function App() {
  const [songs,setSongs]= useState([

  ])
  return (
    <>
      <FaceExpression setSongs={setSongs}/>
      <MoodSongs Songs={songs} />
    </>
  )
}

export default App
