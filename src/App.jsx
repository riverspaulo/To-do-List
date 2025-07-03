import { useState } from 'react'
import './App.css'
import Escopo from './componentes/Escopo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Escopo/>
    </>
  )
}

export default App
