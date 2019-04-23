import React, {Component} from 'react'
import {getPortfolio} from '../store/assetallocation'
import {getStockPriceForAssetAllocation} from '../store/chart'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  FlexibleXYPlot,
  BarSeries,
  XAxis,
  YAxis,
  RectSeries,
  VerticalBarSeries,
  RadialChart
} from 'react-vis'
import {Table} from 'semantic-ui-react'

// const myPalette = ['purple', 'violet', 'pink', 'blue']
// let count = 0
class PortfolioDataTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      portfolio: [],
      intervalId: 0,
      currentUser: 0
    }
    this.intervalFunc = this.intervalFunc.bind(this)
    this.numberWithCommas = this.numberWithCommas.bind(this)
  }

  async intervalFunc() {
    const callBack = (func, userId) => {
      func(userId)
    }
    this.props.getPortfolio(this.state.currentUser)
    const intervalId = setInterval(() => {
      callBack(this.props.getPortfolio, this.props.userId)
    }, 50000)
    await this.setState({intervalId})
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }
  async componentDidMount() {
    this.setState({
      portfolio: this.props.portfolio,
      currentUser: this.props.userId
    })
    await this.intervalFunc()
    this.props.getPortfolio(this.props.userId)
  }
  componentDidUpdate(prevProps) {
    //conditional to check prevProps against current Props
    const quantOfPrev = prevProps.portfolio.reduce((accum, val) => {
      accum += val[2]
      return accum
    }, 0)
    const quantOfCurrent = this.props.portfolio.reduce((accum, val) => {
      accum += val[2]
      return accum
    }, 0)
    if (quantOfPrev !== quantOfCurrent) {
      //dispatch getPortfolio
      this.props.getPortfolio(this.props.userId)
    }
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  render() {
    return (
      <div className="portfoliolist-container">
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Ticker</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Current Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {this.props.portfolio.map((val, idx) => {
            return (
              <Table.Body key={idx}>
                <Table.Row id={`portfolioData${idx}`}>
                  <Table.Cell>{val[0]}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {this.numberWithCommas(val[2])}
                  </Table.Cell>
                  <Table.Cell>
                    ${this.numberWithCommas(val[1].toFixed(0))}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )
          })}
          {/* </div> */}
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    portfolio: state.assetallocation.portfolio,
    userId: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: userId => dispatch(getPortfolio(userId)),
    getStockPriceForAssetAllocation: ticker =>
      dispatch(getStockPriceForAssetAllocation(ticker))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortfolioDataTable)
)
