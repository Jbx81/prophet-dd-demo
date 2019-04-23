import React, {Component} from 'react'
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  DiscreteColorLegend,
  VerticalGridLines,
  LineMarkSeries
} from 'react-vis'
import {getPortfolio} from '../store/assetallocation'
import {getComparedStockPrice} from '../store/compareChart'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

const axisProps = {
  tickSizeInner: 0,
  style: {line: {stroke: '#939393', strokeWidth: '1px'}}
}

class CompareChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeFrame: '3m'
    }
  }

  render() {
    const {series} = this.props

    return (
      <div>
        <div>
          <h2 className="compareChart">
            Nike - P&G Trailing 3 Month Stock Prices
          </h2>
          <DiscreteColorLegend
            items={['Procter & Gamble - $PG', 'Nike - $NKE']}
            orientation="horizontal"
          />
          <XYPlot animation width={700} height={300} yDomain={[60, 1200]}>
            <VerticalGridLines />
            <HorizontalGridLines />

            <XAxis {...axisProps} tickFormat={String} />
            <YAxis {...axisProps} tickFormat={d => '$' + d} />

            {series.map((d, i) => <LineMarkSeries key={i} size={3} data={d} />)}
          </XYPlot>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    historicalPrices: state.chart.historicalPrices,
    series: state.compareChart.compareData,
    ticker1: state.compareChart.ticker1,
    ticker2: state.compareChart.ticker2
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: () => dispatch(getPortfolio()),
    getCompanyStockPrices: (ticker1, ticker2, time) =>
      dispatch(getComparedStockPrice(ticker1, ticker2, time))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CompareChart)
)
