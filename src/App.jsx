import { useState } from 'react'
import './App.css'
import React from 'react'
import MyMap from './Map.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <MyMap />
    </>
  )
}

export default App
