const fs = require("fs");
const merkle = require("merkle");
const cryptojs = require("crypto-js");
// const hexToBinary = require('hex-to-binary');

const BLOCK_GENERATION_INTERVAL = 2; // 초단위
const DIFFICULTY_ADJUSTMENT_INTERVAL = 3; // 블록이 생성되는 간격(난이도 간격)

const { Block, BlockHeader } = require("./blockclass");
const { createHash } = require("../utils/hash");

function getVersion() {
  const package = fs.readFileSync("package.json");
  return JSON.parse(package).version;
}

function createGenesisBlock() {
  const version = getVersion();
  const index = 0;
  const previousHash = "0".repeat(64);
  const timestamp = 1231006505; // 2009/01/03 6:15pm (UTC)
  const body = ["The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"];
  const tree = merkle("sha256").sync(body);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = 1;
  const nonce = 0;

  const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce);

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
  const difficulty = Blocks[Blocks.length - 1].header.difficulty;
  // const nonce = 0

  const header = findBlock(version, index, previousHash, timestamp, merkleRoot, difficulty);
  return new Block(header, bodyData);
}

function replaceChain(newBlocks) {
  if (isValidChain(newBlocks)) {
    // 순환 에러 해결 중
    if (newBlocks.length > Blocks.length || newBlocks.length === Blocks.length) {
      Blocks = newBlocks;
      broadcast(responseLatestMsg());
    }
  } else {
    console.log("받은 원장 오류");
  }
}

function hashMatchesDifficulty(hash, difficulty) {
  const hashBinary = hexToBinary(hash).substring(0, difficulty);
  return hashBinary.startsWith("0".repeat(difficulty)); // 시작부분이 같으면 true
}

function findBlock(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty) {
  let nonce = 0;

  while (true) {
    let hash = calcurateHash(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, nonce);

    if (hashMatchesDifficulty(hash, difficulty)) {
      return new BlockHeader(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, nonce);
    }
    nonce++;
  }
}

function calcurateHash(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, nonce) {
  const blockString = currentVersion + nextIndex + previousHash + nextTimestamp + merkleRoot + difficulty + nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
}

function getDifficulty(blocks) {
  const lastBlock = blocks[blocks.length - 1];
  if (lastBlock.header.index !== 0 && lastBlock.header.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0) {
    return getAdjustDifficulty(lastBlock, blocks);
  }

  return lastBlock.header.difficulty;
}

function getAdjustDifficulty(lastBlock, blocks) {
  const prevAdjustmentBlock = blocks[blocks.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
  const elapsedTime = lastBlock.header.timestamp - prevAdjustmentBlock.header.timestamp;
  const expectedTime = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;

  // const BLOCK_GENERATION_INTERVAL = 2  // 초단위
  // const DIFFICULTY_ADJUSTMENT_INTERVAL = 3 // 블록이 생성되는 간격(난이도 간격)

  if (expectedTime / 2 > elapsedTime) {
    return prevAdjustmentBlock.header.difficulty + 1;
  } else if (expectedTime * 2 < elapsedTime) {
    return prevAdjustmentBlock.header.difficulty - 1;
  } else {
    return prevAdjustmentBlock.header.difficulty;
  }
}

function getCurrentTimestamp() {
  return Math.round(new Date().getTime() / 1000);
}

function isValidTimestamp(newBlock, prevBlock) {
  /* 최초의 블록은 검색예외 보존 */
  if (prevBlock.header.timestamp === 1231006505) {
    return true;
  }

  if (newBlock.header.timestamp - prevBlock.header.timestamp > 60) {
    return false;
  }

  if (newBlock.header.timestamp - getCurrentTimestamp() > 60) {
    return false;
  }
  return true;
}

module.exports = {
  Blocks,
  getLastBlock,
  nextBlock,
  getBlocks,
  getVersion,
  replaceChain,
  getDifficulty,
  isValidTimestamp,
  hashMatchesDifficulty,
};
