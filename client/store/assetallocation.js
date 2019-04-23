import axios from 'axios'

const GET_PORTFOLIO = 'GET_PORTFOLIO'
const BUY_STOCK = 'BUY_STOCK'
const SELL_STOCK = 'SELL_STOCK'

const initialState = {
  portfolio: []
}

const gotPortfolio = portfolio => ({
  type: GET_PORTFOLIO,
  portfolio
})

const boughtStock = stockBought => ({
  type: BUY_STOCK,
  stockBought
})

const soldStock = updatedPortfolio => ({
  type: SELL_STOCK,
  updatedPortfolio
})

export const getPortfolio = userId => {
  return async dispatch => {
    try {
      const {data: portfolioValues} = await axios.get(
        `/api/portfolio/${userId}`
      )
      const arrForPortfolioBecauseReduceAsynIssue = []
      //for loop
      //drop values into arrForPortfolioBecauseReduceAsynIssue
      //return arrForPortfolioBecauseReduceAsynIssue
      for (let i = 0; i < portfolioValues.length; i++) {
        let val = portfolioValues[i]
        if (val.ticker !== 'MONEY') {
          const {data: currPrice} = await axios.get(
            `/api/iex/stockprice/${val.ticker}`
          )
          const priceIn = +val.quantity * +currPrice
          arrForPortfolioBecauseReduceAsynIssue.push([
            val.ticker,
            priceIn,
            val.quantity
          ])
        } else {
          arrForPortfolioBecauseReduceAsynIssue.push([
            val.ticker,
            val.quantity,
            val.quantity
          ])
        }
      }
      dispatch(gotPortfolio(arrForPortfolioBecauseReduceAsynIssue))
    } catch (err) {
      console.error('You dont own anything', err.message)
    }
  }
}

export const getStockPriceToBuy = (orderDetails, userId) => {
  return async dispatch => {
    try {
      const {data: iexRealTimeQuote} = await axios.get(
        `https://api.iextrading.com/1.0/stock/${orderDetails.ticker}/quote`
      )
      // eventually we will pass the price and stock quantity with the axios call
      const updatedPortfolio = await axios.put(`/api/users/${+userId}/buy`, {
        iexRealTimeQuote,
        orderDetails
      })
      const arrForPortfolioBecauseReduceAsynIssue = []
      //for loop
      //drop values into arrForPortfolioBecauseReduceAsynIssue
      //return arrForPortfolioBecauseReduceAsynIssue
      for (let i = 0; i < updatedPortfolio.length; i++) {
        let val = updatedPortfolio[i]
        if (val.ticker !== 'MONEY') {
          const {data: currPrice} = await axios.get(
            `/api/iex/stockprice/${val.ticker}`
          )
          const priceIn = +val.quantity * +currPrice
          arrForPortfolioBecauseReduceAsynIssue.push([
            val.ticker,
            priceIn,
            val.quantity
          ])
        } else {
          arrForPortfolioBecauseReduceAsynIssue.push([
            val.ticker,
            val.quantity,
            val.quantity
          ])
        }
      }
      dispatch(boughtStock(arrForPortfolioBecauseReduceAsynIssue))
    } catch (err) {
      console.error('There are no stocks shown', err.message)
    }
  }
}

export const getStockPriceToSell = (orderDetails, userId) => {
  return async dispatch => {
    try {
      const {data: iexRealTimeQuote} = await axios.get(
        `https://api.iextrading.com/1.0/stock/${orderDetails.ticker}/quote`
      )
      // eventually we will pass the price and stock quantity with the axios call
      const updatedPortfolio = await axios.put(`/api/users/${+userId}/sell`, {
        iexRealTimeQuote,
        orderDetails
      })
      //grab the array that we will return later from gotPortfolio
      const arrForPortfolioBecauseReduceAsynIssue = []
      //then, we'll use a for loop on the promise updatedPortfolio to get right data structure
      for (let i = 0; i < updatedPortfolio.length; i++) {
        let val = updatedPortfolio[i]
        if (val.ticker !== 'MONEY') {
          const {data: currPrice} = await axios.get(
            `/api/iex/stockprice/${val.ticker}`
          )
          const priceIn = +val.quantity * +currPrice
          arrForPortfolioBecauseReduceAsynIssue.push([
            val.ticker,
            priceIn,
            val.quantity
          ])
        } else {
          arrForPortfolioBecauseReduceAsynIssue.push([
            val.ticker,
            val.quantity,
            val.quantity
          ])
        }
      }
      //we'll change the dispatch to send the right item
      dispatch(soldStock(arrForPortfolioBecauseReduceAsynIssue))
    } catch (err) {
      console.error('There are no stocks shown', err.message)
    }
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PORTFOLIO:
      return {
        ...state,
        portfolio: action.portfolio
      }
    case BUY_STOCK:
      return {
        ...state,
        portfolio: action.stockBought
      }
    case SELL_STOCK:
      return {
        ...state,
        portfolio: action.updatedPortfolio
      }
    default:
      return state
  }
}
