import React from 'react'
import RedditAnalytics from '../components/charts/RedditAnalytics'
import ThemeToggle from '../components/ThemeToggle'

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <RedditAnalytics />
         <ThemeToggle />
    </div>
  )
}

export default Dashboard