class Block {
  constructor(header, body) {
    this.header = header
    this.body = body
  }
}

class BlockHeader {
  constructor (version, index, previousHash, timestamp, merkleRoot, difficulty, nonce) {
    this.version = version
    this.index = index
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.merkleRoot = merkleRoot
    this.difficulty = difficulty
    this.nonce = nonce
  }
}

module.exports = { Block, BlockHeader };
