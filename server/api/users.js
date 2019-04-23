const router = require('express').Router()
const {User, Transaction, Stock, Portfolio} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'cash']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/transactions', async (req, res, next) => {
  try {
    const transactions = await Transaction.findByUser(req.params.userId)
    res.send(transactions)
  } catch (error) {
    next(error)
  }
})

router.get('/:userId/portfolio', async (req, res, next) => {
  try {
    const userPortfolio = await User.getPortfolio(req.params.userId)
    res.send(userPortfolio)
  } catch (error) {
    next(error)
  }
})

// router.get('/:userId/portfolio', async (req, res, next) => {
//   try {
//     const usersTransactions = await Transaction.findByUser(req.params.userId)
//     const getPortfolio = usersTransactions.reduce((accum, val) => {
//       let tickTick = val.dataValues.ticker
//       let shares = val.dataValues.transQuantity
//       let transType = val.dataValues.transactionType
//       if (transType === 'sell') {
//         shares *= -1
//       }
//       if (accum[tickTick] !== undefined) {
//         accum[tickTick] += shares
//       } else {
//         accum[tickTick] = shares
//       }
//       return accum
//     }, {})
//     res.send(getPortfolio)
//   } catch (error) {
//     next(error)
//   }
// })

router.put('/:userId/buy', async (req, res, next) => {
  let stockTicker = req.body.iexRealTimeQuote.symbol
  let realTimeQuote = req.body.iexRealTimeQuote.latestPrice
  let quantity = +req.body.orderDetails.quantity
  try {
    // check to see if the stock exists in Stock table.  If not, create it.
    await Stock.findOrCreate({
      where: {
        name: stockTicker
      }
      // check to see if the user has enough cash
    })
    const user = await User.findById(+req.params.userId)
    let cashValue = realTimeQuote * quantity
    if (user.dataValues.cash >= cashValue) {
      await Transaction.createTrade(
        stockTicker,
        realTimeQuote,
        quantity,
        'buy',
        req.params.userId
      )
    } else {
      throw new Error('Not enough $$')
    }
    await user.cashUpdate(req.params.userId, cashValue)
    const userPortfolio = await Portfolio.getPortfolio(req.params.userId)
    res.send(userPortfolio)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId/sell', async (req, res, next) => {
  let stockTicker = req.body.iexRealTimeQuote.symbol
  let realTimeQuote = req.body.iexRealTimeQuote.latestPrice
  let quantity = +req.body.orderDetails.quantity
  let cashValue = realTimeQuote * quantity * -1
  try {
    const ownsIt = await Transaction.findByUserAndStock(
      req.params.userId,
      stockTicker
    )
    if (!ownsIt) {
      throw new Error("Sorry, you don't own this.")
    }
    //check all buys
    //check all sells
    const howMuch = ownsIt.reduce((accum, val) => {
      let transType = val.dataValues.transactionType
      let quant = val.dataValues.transQuantity
      if (transType === 'sell') {
        quant *= -1
      }
      accum += quant
      return accum
    }, 0)
    //create sell transaction
    if (howMuch >= quantity) {
      await Transaction.createTrade(
        stockTicker,
        realTimeQuote,
        quantity,
        'sell',
        req.params.userId
      )
      const findUser = await User.findById(req.params.userId)
      //make sure to User.findById AND let cashValue to negative
      await findUser.cashUpdate(req.params.userId, cashValue)
      const userPortfolio = await Portfolio.getPortfolio(req.params.userId)
      res.send(userPortfolio)
    } else {
      throw new Error("you don't own enough!")
    }
  } catch (error) {
    next(error.message)
  }
})
