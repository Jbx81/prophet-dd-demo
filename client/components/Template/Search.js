import React, {Component, useState} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {Button, Segment, Modal, Transition} from 'semantic-ui-react'
import {getStockPrice} from '../../store/chart'
import {getComparedStockPrice} from '../../store/compareChart'

class SearchModal extends Component {
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
        <Button
          id="help-btn"
          onClick={this.show('tiny')}
          icon="question circle outline icon"
        />
        <div>
          <Transition.Group
            open={open}
            transition="horizontal-flip"
            duration={1000}
          >
            {open && (
              <Modal size={size} open={open} onClose={this.close}>
                <Modal.Header>What is an equity?</Modal.Header>
                <Modal.Content>
                  <p>
                    Definition: the value of the shares issued by a company.
                  </p>
                  <p>
                    Enter a unique stock ticker (ie, Apple [AAPL], Alphabet
                    [GOOG], Tesla [TSLA])
                  </p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={this.close}
                    positive
                    icon="checkmark"
                    labelPosition="right"
                    content="Got it!"
                  />
                </Modal.Actions>
              </Modal>
            )}
          </Transition.Group>
        </div>
      </div>
    )
  }
}

const Search = (props, initialTime = 'ytd') => {
  const [equity, setEquity] = useState('')
  //not being used
  const [timeFrame, setTimeFrame] = useState(initialTime)

  const handleChange = evt => {
    evt.preventDefault()
    setEquity(evt.target.value)
  }
  const handleSubmit = async () => {
    await props.getStockPrice(equity, 'ytd')
    await setEquity('')
  }

  return (
    <div className="search">
      <SearchModal />
      <div>
        <label>
          Pick a company:
          <input type="text" value={equity} onChange={handleChange} />
        </label>
        <Segment inverted id="search-button">
          <Button
            inverted
            color="purple"
            type="submit"
            value="Submit"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Segment>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    historicalPrices: state.chart.historicalPrices,
    ticker: state.chart.ticker,
    ticker2: state.chart.ticker2
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getStockPrice: (ticker, time, ticker2) =>
      dispatch(getStockPrice(ticker, time, ticker2)),
    getCompanyStockPrices: (ticker1, ticker2, time) =>
      dispatch(getComparedStockPrice(ticker1, ticker2, time))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search))
