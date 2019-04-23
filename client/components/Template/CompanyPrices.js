import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import BuySellPage from '../BuySellPage'

const CompanyPrices = props => {
  return (
    <div className="selector-child-container">
      <h4> Buy and Sell Stocks Here </h4>
      <BuySellPage ticker={props.ticker} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    stats: state.companyDetailsTable.stats,
    ticker: state.chart.ticker
  }
}

export default withRouter(connect(mapStateToProps)(CompanyPrices))
