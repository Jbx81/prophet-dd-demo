import axios from 'axios'

const GOT_COMPARE_STOCK_PRICE = 'GOT_COMPARE_STOCK_PRICE'

const initialState = {compareData: []}

const gotComparedStockPrices = (compareData, ticker1, ticker2) => ({
  type: GOT_COMPARE_STOCK_PRICE,
  compareData,
  ticker1,
  ticker2
})

export const getComparedStockPrice = (
  ticker1,
  ticker2,
  time
) => async dispatch => {
  const compareCompanyData = (HistoricalPrices1, HistoricalPrices2) => {
    return HistoricalPrices1.map((arr, idx) =>
      arr.concat(HistoricalPrices2[idx][1])
    )
  }
  // const ticker = 'AAPL';
  // const time = '5y'
  try {
    const {data: gotHistoricalPrices1} = await axios.get(
      `/api/iex/getChartData/${ticker1}/${time}`
    )
    const {data: gotHistoricalPrices2} = await axios.get(
      `/api/iex/getChartData/${ticker2}/${time}`
    )

    const mergedData = compareCompanyData(
      gotHistoricalPrices1,
      gotHistoricalPrices2
    )

    const series = [2, 1].map(i => mergedData.map(d => ({x: d[0], y: d[i]})))

    dispatch(gotComparedStockPrices(series, ticker1, ticker2))
  } catch (err) {
    console.error('There was an error getting compared stock data', err.message)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_COMPARE_STOCK_PRICE:
      return {
        ...state,
        compareData: action.compareData,
        ticker1: action.ticker1,
        ticker2: action.ticker2
      }
    default:
      return state
  }
}
