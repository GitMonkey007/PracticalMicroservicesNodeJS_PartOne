const { v4: uuid } = require('uuid')

function primeRequestContext (req, res, next) {
  req.context = {
    traceId: uuid()
  }

  next()
}

module.exports = primeRequestContext
