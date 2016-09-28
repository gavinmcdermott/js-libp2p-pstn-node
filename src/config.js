'use strict'

const debug = require('debug')

const log = debug('pstn:node')
log.err = debug('pstn:node:error')

module.exports = {
  log: log,
  keySize: 128,  // in bits; currently shortened to shrink the test keyspace
  basePort: 12000,
}
