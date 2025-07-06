import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Dashboard from './pages/Dashboard'
import AssistantChatbox from './components/AssistantChatbox'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Dashboard />
       <AssistantChatbox />
    </>
  )
}

export default App
