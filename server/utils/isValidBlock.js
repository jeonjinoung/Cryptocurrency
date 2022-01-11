const merkle = require("merkle");
const { Block, BlockHeader } = require("../blockchain/blockclass");
const { Blocks, isValidTimestamp, getLastBlock, getDifficulty, hashMatchesDifficulty } = require("../blockchain/blocks");
const { createHash } = require("./hash");

function isValidBlockStructure(block) {
  return typeof(block.header.version) === 'string'
    && typeof(block.header.index) === 'number'
    && typeof(block.header.previousHash) === 'string'
    && typeof(block.header.timestamp) === 'number'
    && typeof(block.header.merkleRoot) === 'string'
    && typeof(block.header.difficulty) === 'number'
    && typeof(block.header.nonce) === 'number'
    && typeof(block.body) === 'object'
}

function isValidNewBlock(newBlock, previousBlock) {
  if (isValidBlockStructure(newBlock) === false) {
    console.log('Invalid Block Structure');
    return false;
  } else if (newBlock.header.index !== previousBlock.header.index + 1) {
    console.log('Invalid Index');
    return false;
  } else if (createHash(previousBlock) !== newBlock.header.previousHash) {
    console.log('Invalid previousHash');
    return false;
  } else if (newBlock.body.length === 0 && ('0'.repeat(64) !== newBlock.header.merkleRoot) ||
    newBlock.body.length !== 0 && (merkle("sha256").sync(newBlock.body).root() !== newBlock.header.merkleRoot)) {
      console.log('Invalid merkleRoot');
      return false;
  } else if (!isValidTimestamp(newBlock, previousBlock)) {
    console.log("Invalid Timestamp");
    return false;
  } 
  
  return true;
}

/* 순환 에러 */
function isValidChain(newBlocks) {
  if(JSON.stringify(newBlocks[0]) !== JSON.stringify(Blocks[0])) {
    return false;
  };

  var tempBlocks = [newBlocks[0]];
  for (var i = 0; i < newBlocks.length; i++) {    
    if (isValidNewBlock(newBlocks[i], tempBlocks[i - 1])) {
      tempBlocks.push(newBlocks[i]);
    } else {
      return false;
    }
  };
  return true;
};

function addBlock(newBlock) {
  if (isValidNewBlock(newBlock, getLastBlock())) {
    const { version, index, previousHash, timestamp, merkleRoot, nonce } = newBlock.header;
    const { body } = newBlock;

    const newDifficulty = getDifficulty(Blocks);
    
    const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, newDifficulty, nonce);
    const newDifficultyBlock = new Block(header, body);

    Blocks.push(newDifficultyBlock);
    return true;
  }
  return false;
}

module.exports = {
  addBlock,
  isValidNewBlock,
};
