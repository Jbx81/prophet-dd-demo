import axios from 'axios'

const GOT_STOCK_PRICE = 'GOT_STOCK_PRICE'
const GOT_COMPANY_FINANCIALS = 'GOT_COMPANY_FINANCIALS'
const GOT_REAL_TIME_PRICE = 'GOT_REAL_TIME_PRICE'
const GOT_PEERS = 'GOT_PEERS'
const GOT_IN_FOCUS = 'GOT_IN_FOCUS'

const initialState = {
  historicalPrices: [],
  financials: {},
  realTimePrice: 0,
  peers: [],
  inFocusStocks: []
}

const gotStockPrice = (prices, ticker, ticker2 = '') => ({
  type: GOT_STOCK_PRICE,
  prices,
  ticker,
  ticker2
})

const gotFinancials = company => ({
  type: GOT_COMPANY_FINANCIALS,
  company
})

const gotStockPriceForAssetAllocation = stock => ({
  type: GOT_REAL_TIME_PRICE,
  stock
})

const gotPeers = ticker => ({
  type: GOT_PEERS,
  ticker
})

const gotInFocus = focus => ({
  type: GOT_IN_FOCUS,
  focus
})

export const getStockPrice = (ticker, time) => async dispatch => {
  try {
    const {data: gotHistoricalPrices} = await axios.get(
      `/api/iex/getChartData/${ticker}/${time}`
    )

    dispatch(gotStockPrice(gotHistoricalPrices, ticker))
  } catch (err) {
    console.error('BIGGG Drama Show', err.message)
  }
}

export const getStockPriceForAssetAllocation = ticker => async dispatch => {
  try {
    const {data: realTimePrice} = await axios.get(
      `https://api.iextrading.com/1.0/stock/${ticker}/price`
    )
    dispatch(gotStockPriceForAssetAllocation(realTimePrice))
  } catch (err) {
    console.error('BIGGG Drama Show', err.message)
  }
}

export const getFinancials = () => async dispatch => {
  try {
    const {data: financials} = await axios.get(
      `https://api.iextrading.com/1.0/stock/aapl/financials`
    )
    dispatch(gotFinancials(financials))
  } catch (err) {
    console.error('LIONS ONLY', err.message)
  }
}

export const getPeers = ticker => async dispatch => {
  try {
    const {data: peers} = await axios.get(
      `https://api.iextrading.com/1.0/stock/${ticker}/relevant`
    )
    dispatch(gotPeers(peers.symbols))
  } catch (error) {
    console.error('Peers not loading')
  }
}

export const getInFocus = () => async dispatch => {
  try {
    const {data: focusStocks} = await axios.get(
      `https://api.iextrading.com/1.0/stock/market/list/infocus`
    )
    dispatch(gotInFocus(focusStocks))
  } catch (err) {
    console.error('No stocks in focus')
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_STOCK_PRICE:
      return {
        ...state,
        historicalPrices: action.prices,
        ticker: action.ticker,
        ticker2: action.ticker2
      }
    case GOT_REAL_TIME_PRICE:
      return {
        ...state,
        realTimePrice: action.stock
      }
    case GOT_COMPANY_FINANCIALS:
      return {
        ...state,
        financials: action.company
      }
    case GOT_PEERS:
      return {
        ...state,
        peers: action.ticker
      }
    case GOT_IN_FOCUS:
      return {
        ...state,
        inFocusStocks: action.focus
      }
    default:
      return state
  }
}
