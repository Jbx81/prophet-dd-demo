import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {getStockPriceToBuy, getStockPriceToSell} from '../store/assetallocation'
import {Button, Segment} from 'semantic-ui-react'

const BuySellPage = (props, initialTicker = '', initialQuantity = 0) => {
  const [ticker, setTicker] = useState(initialTicker)
  const [quantity, setQuantity] = useState(initialQuantity)
  const handleSubmitBuy = evt => {
    evt.preventDefault()
    props.buyStock({ticker, quantity}, props.userId)
    setQuantity(0)
  }
  const handleSubmitSell = evt => {
    evt.preventDefault()
    props.sellStock({ticker, quantity}, props.userId)
    setQuantity(0)
  }
  useEffect(() => {
    setTicker(props.ticker)
  }, [props.ticker])
  return (
    <div className="buy-sell-everything-container">
    <h5>Selected stock ticker:</h5>
    <div className="buy-sell-ticker">
      <h3>{props.ticker}</h3>
    </div>
    <div className="buy-sell-quantity">
      <label>Quantity to Buy or Sell: </label>
      <input
        required
        name="quantity"
        value={quantity}
        onChange={evt => setQuantity(evt.target.value)}
      />
    </div>
    <div className="small ui vertical buttons">
      <Segment inverted id="buy">
        <Button
          className="ui buttons"
          inverted
          color="purple"
          type="submit"
          onClick={handleSubmitBuy}
        >
          Buy
        </Button>
      </Segment>
      <Segment inverted id="sell">
        <Button
          className="ui buttons"
          inverted
          color="purple"
          type="submit"
          onClick={handleSubmitSell}
        >
          Sell
        </Button>
      </Segment>
    </div>
  </div>
  )
}

const mapStateToProps = state => {
  return {
    userId: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    buyStock: (orderDetails, userId) =>
      dispatch(getStockPriceToBuy(orderDetails, userId)),
    sellStock: (orderDetails, userId) =>
      dispatch(getStockPriceToSell(orderDetails, userId))
  }
}

const CompanyWithStore = connect(mapStateToProps, mapDispatchToProps)(
  BuySellPage
)

export default CompanyWithStore
