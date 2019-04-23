import axios from 'axios'

const GET_PORTFOLIO_FOR_TABLE_FORMAT = 'GET_PORTFOLIO_FOR_TABLE_FORMAT'

const initialState = {
  portfolio: []
}

const gotPortfolioDataForTableFormat = portfolioData => ({
  type: GET_PORTFOLIO_FOR_TABLE_FORMAT,
  portfolioData
})

export const getPortfolioData = userId => {
  return async dispatch => {
    try {
      const {data: iexJSON} = await axios.get(`/api/portfolio/${userId}`)
      const annualFinancialReportFromIEX = await iexJSON
      dispatch(gotPortfolioDataForTableFormat(annualFinancialReportFromIEX))
    } catch (err) {
      console.error(
        'No data to report on this company. Call the SEC.',
        err.message
      )
    }
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PORTFOLIO_FOR_TABLE_FORMAT:
      return {
        ...state,
        portfolio: action.portfolioData
      }
    default:
      return state
  }
}
