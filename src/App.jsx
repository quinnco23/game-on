import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import TapScorePrototype from "./components/GameOn"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <TapScorePrototype/>
    </>
  )
}

export default App


