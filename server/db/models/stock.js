const Sequelize = require('sequelize')
const db = require('../db')

const Stock = db.define('stock', {
  name: {
    type: Sequelize.STRING
  }
})

module.exports = Stock
