import React, {Component, useEffect} from 'react'
import {connect} from 'react-redux'
// import {getPortfolioData} from '../store/companyDetailsTable'
import {getStats} from '../../store/financialDataTable'
import {withRouter} from 'react-router'
import {Table, Button, Modal, Transition, TableCell} from 'semantic-ui-react'
import axios from 'axios'

class ScoreCardModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }
  show = size => () => this.setState({size, open: true})
  close = () => this.setState({open: false})
  render() {
    const {open, size} = this.state
    return (
      <div>
        <h4>
          {' '}
          Wondering how we calculate our scorecard?{' '}
          <Button
            onClick={this.show('tiny')}
            id="help-btn"
            icon="question circle outline icon"
          />{' '}
        </h4>
        <Transition.Group
          open={open}
          transition="horizontal-flip"
          duration={1000}
        >
          {open && (
            <Modal size={size} open={open} onClose={this.close}>
              <Modal.Header>
                Wondering how we calculate our scorecard?
              </Modal.Header>
              <Modal.Content>
                <p>
                  <b>Growth:</b> This is a measurement of Earnings per Share
                  growth within the last year.
                </p>
                <p>
                  Earnings per share (EPS) is the portion of a company's profit
                  allocated to each share of stock. Many investors look to this
                  of as an indicator of profitability and stock prices can swing
                  a lot after companies report these every quarter.
                </p>

                <p>
                  <b>Health:</b> This is a measurement of liquidity of a
                  company.
                </p>
                <p>
                  This is based on how much short-term liabilities they have
                  versus short-term assets. So it's measuring if they have big
                  payments to make versus how much they have in bank or stuff
                  they can sell to make the payment. Usually, being over 1 is a
                  good sign.
                </p>

                <p>
                  <b>Valuation:</b> This is a measurement of Price-to-Sales.
                </p>
                <p>
                  Price-to-Sales value of the dollar stock price a company is
                  currently trading at versus dollar sales the company does. It
                  can be calculated either by dividing the company’s market
                  capitalization by its total sales over a designated period –
                  usually twelve months, or on a per-share basis by dividing the
                  stock price by sales per share. The P/S ratio is also known as
                  a “sales multiple” or “revenue multiple.”
                </p>

                <p>
                  <b>Profitability:</b> This is a measurement of Return of
                  Assets.
                </p>
                <p>
                  Return on assets (ROA) is an indicator of how profitable a
                  company is relative to its total assets. ROA gives a manager,
                  investor, or analyst an idea as to how efficient a company's
                  management is at using its assets to generate earnings. Return
                  on assets is displayed as a percentage and its calculated as:
                  ROA = Net Income / Total Assets
                </p>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  onClick={this.close}
                  positive
                  icon="checkmark"
                  color="purple"
                  labelPosition="right"
                  content="Got it!"
                />
              </Modal.Actions>
            </Modal>
          )}
        </Transition.Group>
      </div>
    )
  }
}

const CompanyDetails = props => {
  useEffect(
    () => {
      props.getStats(props.ticker)
    },
    [props.ticker]
  )
  const {company} = props
  return (
    <div className="companyDetails-container">
      <h5>Prophet Scorecard for: {props.stats.companyName}</h5>
      <ScoreCardModal />
      <div className="financialList">
        <Table striped class="ui violet table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Price:</Table.HeaderCell>
              {company.map(val => {
                return (
                  <Table.HeaderCell key={val[0]}>{val[0]}:</Table.HeaderCell>
                )
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                ${(
                  props.stats.marketcap / props.stats.sharesOutstanding
                ).toFixed(2)}
              </Table.Cell>
              {company.map(val => {
                return <Table.Cell key={val[0]}>{val[1].toFixed(2)}</Table.Cell>
              })}
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    stats: state.companyDetailsTable.stats,
    ticker: state.chart.ticker,
    company: state.financialDataTable.company
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getStats: ticker => dispatch(getStats(ticker))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CompanyDetails)
)
