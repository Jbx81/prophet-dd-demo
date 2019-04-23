import React from 'react'
import Dashboard from './Dashboard'
import UserPortfolio from './UserPortfolio'
import Header from './Header'
import Selector from './Selector'

const ParentContainer = () => {
  return (
    <div className="parent-container">
      <div className="header-container">
        <Header />
      </div>
      <div className="portfolio-dashboard-selector-container">
        <UserPortfolio />
        <Dashboard />
        <Selector />
      </div>
    </div>
  )
}

export default ParentContainer
