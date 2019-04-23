import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import PortfolioList from './PortfolioList'
import AssetAllocation from '../AssetAllocation'
import {getPortfolio} from '../../store/assetallocation'

const UserPortfolio = (props, initialPortfolio = []) => {
  const [portfolio, setPortfolio] = useState(initialPortfolio)
  useEffect(
    () => {
      setPortfolio(props.portfolio)
    },
    [props.portfolio]
  )
  return (
    <div className="portfolio-container">
      <PortfolioList />
      <AssetAllocation portfolioData={portfolio} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    portfolio: state.assetallocation.portfolio
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: () => dispatch(getPortfolio())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserPortfolio)
)
