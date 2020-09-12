const jwt = require("jsonwebtoken")

const createJwtToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

module.exports = { createJwtToken }
