const fs = require("fs");
const merkle = require("merkle");

const { Block, BlockHeader } = require("./blockclass");
const { createHash } = require("../utils/hash");
// const { isValidChain } = require("../utils/isValidBlock");

function getVersion() {
  const package = fs.readFileSync("package.json");
  return JSON.parse(package).version;
}

function createGenesisBlock() {
  const version = getVersion();
  const index = 0;
  const previousHash = "0".repeat(64);
  const timestamp = 1231006505;
  const body = ["무기거래소 최초의 블럭"];
  const tree = merkle("sha256").sync(body);
  const merkleRoot = tree.root() || "0".repeat(64);

  const header = new BlockHeader(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot
  );
  return new Block(header, body);
}

let Blocks = [createGenesisBlock()];

function getBlocks() {
  return Blocks;
}

function getLastBlock() {
  return Blocks[Blocks.length - 1];
}

function nextBlock(bodyData) {
  const prevBlock = getLastBlock(); 
  const version = getVersion(); 
  const index = prevBlock.header.index + 1;
  const previousHash = createHash(prevBlock);
  const timestamp = parseInt(Date.now() / 1000);
  const tree = merkle("sha256").sync(bodyData);
  const merkleRoot = tree.root() || "0".repeat(64);

  const header = new BlockHeader(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot
  );
  return new Block(header, bodyData);
}

function replaceChain(newBlocks) {
  if (isValidChain(newBlocks)) {
    if ((newBlocks.length > Blocks.length) || (newBlocks.length === Blocks.length) && random.boolean()) {
      Blocks = newBlocks;
      broadcast(responseLatestMsg());
    }
  } else {
    console.log("받은 원장 오류");
  }
}

module.exports = {
  Blocks,
  getLastBlock,
  nextBlock,
  getBlocks,
  getVersion,
  replaceChain,
}