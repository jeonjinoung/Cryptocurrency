class Block {
  constructor(header, body) {
    this.header = header
    this.body = body
  }
}

class BlockHeader {
    constructor(version, index, previousHash, timestamp, transection, merkleRoot, difficulty, nonce) {
        this.version = version;
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transection = transection;
        this.merkleRoot = merkleRoot;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

module.exports = { Block, BlockHeader };