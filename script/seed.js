'use strict'

const db = require('../server/db')
const {User, Transaction, Stock} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'jon@jon.com', password: '123', cash: 100000}),
    User.create({email: 'pib@bib.com', password: '123', cash: 100000})
  ])

  const stocks = await Promise.all([
    Stock.create({name: 'AAPL'}),
    Stock.create({name: 'TSLA'})
  ])

  const transactions = await Promise.all([
    Transaction.create({
      ticker: 'AAPL',
      price: 117,
      transQuantity: 150,
      transactionType: 'buy',
      userId: 1,
      stockId: 1
    }),
    Transaction.create({
      ticker: 'AAPL',
      price: 133,
      transQuantity: 40,
      transactionType: 'sell',
      userId: 1,
      stockId: 1
    }),
    Transaction.create({
      ticker: 'AAPL',
      price: 105,
      transQuantity: 205,
      transactionType: 'buy',
      userId: 1,
      stockId: 1
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${transactions.length} transactions`)
  console.log(`seeded ${stocks.length} stocks`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
