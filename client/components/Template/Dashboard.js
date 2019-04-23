import React from 'react'
import FeaturedChart from './FeaturedChart'
import CompanyFinancials from '../CompanyFinancials'
import CompanyDetails from './CompanyDetails'
import TickerArea from './TickerArea'

const Dashboard = () => {
  return (
    // <div className="dashboard-jsx-wrapper">
    <div className="chart-container">
      <FeaturedChart />

      <div className="dashboard-financials-details-container">
        <CompanyFinancials />
        <CompanyDetails />
      </div>

      <TickerArea />
    </div>
  )
}

export default Dashboard
