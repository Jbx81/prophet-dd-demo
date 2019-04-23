import axios from 'axios'

//action variable
const GET_PRICES = 'GET_PRICES'
// const INCREASE_CASH = 'INCREASE_CASH'
// const DECREASE_CASH = 'DECREASE_CASH'

const initialState = {
  data: []
}

//action creator
const gettingPrices = symbolsObjWithRealTimePrice => ({
  type: GET_PRICES,
  symbolsObjWithRealTimePrice
})

// thunks
export const getPriceFromAPI = () => {
  return async dispatch => {
    try {
      const {data: iexRealTimePricesForAllStocks} = await axios.get(
        `https://api.iextrading.com/1.0/stock/market/previous`
      )
      // eventually we will pass the price and stock quantity with the axios call
      const stockSymbolsArray = Object.keys(iexRealTimePricesForAllStocks)
      //let date = iexRealTimePricesForAllStocks[stockSymbolsArray[0]].date;
      const symbols = stockSymbolsArray.map(stock => {
        return iexRealTimePricesForAllStocks[stock]
      })
      dispatch(gettingPrices(symbols))
    } catch (err) {
      console.error('Stock market failure. Black Monday.', err.message)
    }
  }
}

//reducer
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PRICES:
      return {
        ...state,
        data: action.symbolsObjWithRealTimePrice
      }
    default:
      return state
  }
}
