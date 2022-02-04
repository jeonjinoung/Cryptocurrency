const cryptojs = require("crypto-js");

function createHash(data) {
  const { version, previousHash, timestamp, transection, merkleRoot, difficulty, nonce } = data.header;
  const blockString = version + previousHash + timestamp + transection + merkleRoot + difficulty + nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
};

module.exports = { createHash };
