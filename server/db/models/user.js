const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
const Portfolio = require('./portfolio')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  cash: {
    type: Sequelize.INTEGER,
    defaultValue: 100000,
    validate: {
      min: 0
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */

//can't reference cash --> can only reference original model//
User.prototype.cashUpdate = function(userId, cashChange) {
  userId = Number(userId)
  cashChange = Number(cashChange)
  this.cash = Number(this.cash)
  return User.update(
    {
      cash: this.cash - cashChange
    },
    {
      where: {
        id: userId
      }
    }
  )
}

User.getPortfolio = function(userId) {
  return Portfolio.findAll({
    where: {
      userId
    }
  })
}

User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.afterCreate(async user => {
  await Portfolio.create({
    ticker: 'MONEY',
    quantity: user.cash,
    currentMarketValue: user.cash,
    userId: user.id
  })
})
