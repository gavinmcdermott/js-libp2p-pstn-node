'use strict'

const expect = require('chai').expect
const R = require('ramda')

const Bitswap = require('ipfs-bitswap')
const libp2p = require('libp2p-ipfs')
const PeerInfo = require('peer-info')
const Repo = require('ipfs-repo')

const keys = require('./fixtures/keys')
const Node = require('./../src/index')

describe('Node', () => {
  let nodeA
  let nodeB

  const configA = {
    id: keys.keys[0],
    portOffset: 0
  }

  const configB = {
    id: keys.keys[1],
    portOffset: 1
  }

  // Must kill connections for further other tests!
  after(() => {
    nodeA.libp2p.swarm.close()
    nodeB.libp2p.swarm.close()
  })

  it('succeeds', () => {
    nodeA = new Node(configA)
    expect(nodeA).to.exist
    expect(nodeA instanceof Node).to.be.true
    expect(nodeA.peerInfo).to.exist
    expect(nodeA.peerInfo instanceof PeerInfo).to.be.true
    expect(nodeA.libp2p).to.exist
    expect(nodeA.libp2p instanceof libp2p.Node).to.be.true
    expect(nodeA.repo).to.exist
    expect(nodeA.repo instanceof Repo).to.be.true
    expect(nodeA.bitswap).to.exist
    expect(nodeA.bitswap instanceof Bitswap).to.be.true
  })

  it('multiple nodes init', () => {
    nodeB = new Node(configB)
    expect(nodeB).to.exist
  })

  it(`init`, () => {
    return nodeA.init().then((instance) => {
      expect(instance).to.exist
      expect(instance instanceof Node).to.be.true
    })
  })
})
