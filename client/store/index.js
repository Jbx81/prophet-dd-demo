import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import chart from './chart'
import assetallocation from './assetallocation'
import compareChart from './compareChart'
import financialDataTable from './financialDataTable'
import portfolioDataTable from './portfolioDataTable'
import companyDetailsTable from './companyDetailsTable'
import ticker from './ticker'

const reducer = combineReducers({
  user,
  chart,
  assetallocation,
  compareChart,
  financialDataTable,
  portfolioDataTable,
  companyDetailsTable,
  ticker
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
