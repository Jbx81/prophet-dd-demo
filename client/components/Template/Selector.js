import React from 'react'
import Search from './Search'
import CompanyPrices from './CompanyPrices'
import PeerSelections from './PeerSelections'

const Selector = () => {
  return (
    <div className="selector-container">
      <Search />
      <CompanyPrices />
      <PeerSelections />
    </div>
  )
}

export default Selector
