import React from 'react'

import Dashboard from '../pages/Dashboard'
import AssistantChatbox from '../components/AssistantChatbox'
import LoginWithReddit from '../components/LoginWithReddit';

const Home = () => {
  return (
    <div>
          <Dashboard />
       <AssistantChatbox />
           <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-cyan-950 text-white">
      <LoginWithReddit />
    </div>
    </div>
  )
}

export default Home