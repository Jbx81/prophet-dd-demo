const Sequelize = require('sequelize')
const db = require('../db')
const Portfolio = require('./portfolio')

const Transaction = db.define('transaction', {
  ticker: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.DECIMAL(10, 2)
  },
  transQuantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  transactionType: Sequelize.ENUM('buy', 'sell')
})

module.exports = Transaction

/**
 * classMethod
 */

Transaction.findByUser = function(userId) {
  return Transaction.findAll({
    where: {
      userId
    }
  })
}

Transaction.findByUserAndStock = function(userId, ticker) {
  return Transaction.findAll({
    where: {
      userId,
      ticker
    }
  })
}

Transaction.createTrade = function(
  ticker,
  price,
  transQuantity,
  transactionType,
  userId
) {
  return Transaction.create({
    ticker,
    price,
    transQuantity,
    transactionType,
    userId
  })
}

Transaction.afterCreate(async transaction => {
  const transCost = transaction.transQuantity * transaction.price
  const portToUpdate = await Portfolio.findOne({
    where: {
      ticker: transaction.ticker,
      userId: transaction.userId
    }
  })
  const findUsersMoneyItem = await Portfolio.findOne({
    where: {
      ticker: 'MONEY',
      userId: transaction.userId
    }
  })
  if (portToUpdate && transaction.transactionType === 'buy') {
    await Portfolio.update(
      {
        quantity: portToUpdate.quantity + transaction.transQuantity,
        costValue: portToUpdate.costValue + transCost
      },
      {
        where: {
          ticker: transaction.ticker,
          userId: transaction.userId
        }
      }
    )
    await Portfolio.update(
      {
        quantity: findUsersMoneyItem.quantity - transCost
      },
      {where: {userId: findUsersMoneyItem.userId, ticker: 'MONEY'}}
    )
  } else if (portToUpdate && transaction.transactionType === 'sell') {
    await Portfolio.update(
      {
        quantity: portToUpdate.quantity - transaction.transQuantity,
        //needs to get original transaction cost LIFO/FIFO?
        costValue: portToUpdate.costValue - transCost
      },
      {
        where: {
          ticker: transaction.ticker,
          userId: transaction.userId
        }
      }
    )
    await Portfolio.update(
      {
        quantity: findUsersMoneyItem.quantity + transCost
      },
      {where: {userId: findUsersMoneyItem.userId, ticker: 'MONEY'}}
    )
  } else if (!portToUpdate && transaction.transactionType === 'buy') {
    await Portfolio.create({
      ticker: transaction.ticker,
      quantity: transaction.transQuantity,
      costValue: transCost,
      userId: transaction.userId
    })
    await Portfolio.update(
      {
        quantity: findUsersMoneyItem.quantity - transCost
      },
      {where: {userId: findUsersMoneyItem.userId, ticker: 'MONEY'}}
    )
  } else {
    await Portfolio.create({
      ticker: transaction.ticker,
      quantity: transaction.transQuantity,
      costValue: transCost,
      userId: transaction.userId
    })
    await Portfolio.update(
      {
        quantity: findUsersMoneyItem.quantity + transCost
      },
      {where: {userId: findUsersMoneyItem.userId, ticker: 'MONEY'}}
    )
  }
})
