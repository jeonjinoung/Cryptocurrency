const merkle = require("merkle");
<<<<<<< HEAD
const {
  Blocks,
  getLastBlock,
  nextBlock,
  getVersion,
} = require("../blockchain/blocks");
=======
const { Block, BlockHeader } = require("../blockchain/blockclass");
const { Blocks, isValidTimestamp, getLastBlock, getDifficulty, hashMatchesDifficulty } = require("../blockchain/blocks");
>>>>>>> 8c461373a775d46a87976ddd11c54df41a7b0013
const { createHash } = require("./hash");
function isValidBlockStructure(block) {
<<<<<<< HEAD
  //블럭에 형태가 맞는지 확인하는 함수
  return (
    typeof block.header.version === "string" && //버전이 스트링인지
    typeof block.header.index === "number" && //그리고 넘버인지
    typeof block.header.previousHash === "string" && //그전 해시값인지
    typeof block.header.timestamp === "number" && //만든시간
    typeof block.header.merkleRoot === "string" && //머클루트
    typeof block.body === "object"
  ); //body데이터
=======
  return typeof(block.header.version) === 'string'
    && typeof(block.header.index) === 'number'
    && typeof(block.header.previousHash) === 'string'
    && typeof(block.header.timestamp) === 'number'
    && typeof(block.header.merkleRoot) === 'string'
    && typeof(block.header.difficulty) === 'number'
    && typeof(block.header.nonce) === 'number'
    && typeof(block.body) === 'object'
>>>>>>> 8c461373a775d46a87976ddd11c54df41a7b0013
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

<<<<<<< HEAD
=======
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

>>>>>>> 8c461373a775d46a87976ddd11c54df41a7b0013
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

const block = nextBlock(["상민이가 시켰는데요?"]);
addBlock(block);

module.exports = {
  Blocks,
  getLastBlock,
  createHash,
  addBlock,
<<<<<<< HEAD
  nextBlock,
  getVersion,
=======
  isValidNewBlock,
>>>>>>> 8c461373a775d46a87976ddd11c54df41a7b0013
};
