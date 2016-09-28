'use strict'

const Bitswap = require('ipfs-bitswap')
const bs = require('abstract-blob-store')
const libp2p = require('libp2p-ipfs')
const multiaddr = require('multiaddr')
const os = require('os')
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const R = require('ramda')
const Repo = require('ipfs-repo')
const crypto = require('libp2p-crypto')

const { log }  = require('./config')
const { NodeError }  = require('./errors')

module.exports = class Node {
  constructor(options={}) {
    const portOffset = options.portOffset || 0
    const port = options.port || 12000

    if (!options.id) {
      throw new NodeError('missing <options.id>')
    }
    if (!options.id.privKey) {
      throw new NodeError('missing <options.id.privKey>')
    }

    const privKey = options.id.privKey
    let keyBuffer = ''

    if (typeof privKey === 'string') {
      try {
        keyBuffer = new Buffer(privKey, 'base64')
        crypto.unmarshalPrivateKey(keyBuffer, 'base64')
      } catch (e) {
        throw e
      }
    }

    // Peer info
    const peerId = PeerId.createFromPrivKey(privKey)
    const peerInstance = new PeerInfo(peerId)
    const peerAddr1 = multiaddr(`/ip4/127.0.0.1/tcp/${port + portOffset}/ipfs/${peerInstance.id.toB58String()}`)
    peerInstance.multiaddr.add(peerAddr1)

    // Libp2p info
    const libp2pInstance = new libp2p.Node(peerInstance)

    // object storage
    const tmpDir = os.tmpdir()
    const repoPath = `${tmpDir}/${peerInstance.id.toB58String()}`
    const repoInstance = new Repo(repoPath, { stores: bs })

    // bitswap instance
    const bitswapInstance = new Bitswap(peerInstance, libp2pInstance, repoInstance.datastore, peerInstance.peerBook)

    this.peerInfo = peerInstance
    this.libp2p = libp2pInstance
    this.repo = repoInstance
    this.bitswap = bitswapInstance
  }

  init() {
    return new Promise((resolve, reject) => {
      this.libp2p.start((err) => {
        if (err) {
          // TODO: what is the best way to handle failures?
          log.error(`Unable to init: ${this.peerInfo.id.toB58String()}`)
          return reject(err)
        }
        return resolve(this)
      })
    })
  }
}
