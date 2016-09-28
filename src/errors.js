'use strict'

class NodeError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this)
    this.name = `NodeError`
    this.message = `${message}`
    if (extra) this.extra = extra
  }
}

module.exports = { NodeError }
