'use strict'

const debug = require('debug')

const log = debug('pstn:node')
log.err = debug('pstn:node:error')

module.exports = { log }
