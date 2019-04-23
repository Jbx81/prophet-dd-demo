const Sequelize = require('sequelize')
const db = require('../db')
const axios = require('axios')

const Portfolio = db.define('portfolio', {
  ticker: {
    type: Sequelize.STRING
  },
  quantity: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  },
  costValue: {
    type: Sequelize.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  currentMarketValue: {
    type: Sequelize.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  }
})

const currentMarketPrice = async ticker => {
  const {data: iexRealtimePrice} = await axios.get(
    `https://api.iextrading.com/1.0/stock/${ticker}/quote`
  )
  return iexRealtimePrice.iexRealtimePrice
}

Portfolio.getCurrentMarketValue = async userId => {
  const userPortfolio = await Portfolio.getPortfolio(userId)
  return Portfolio.update(
    {
      currentMarketValue: currentMarketPrice(userPortfolio.quantity)
    },
    {
      where: {
        userId
      }
    }
  )
}

Portfolio.getPortfolio = function(userId) {
  return Portfolio.findAll({
    where: {
      userId
    }
  })
}

module.exports = Portfolio
