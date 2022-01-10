const merkle = require("merkle");
const { Blocks, getLastBlock, getDifficulty } = require("../blockchain/blocks");
const { createHash } = require("./hash");

function isValidBlockStructure(block) {
  return (
    typeof block.header.version === "string" && 
    typeof block.header.index === "number" && 
    typeof block.header.previousHash === "string" && //그전 해시값인지
    typeof block.header.timestamp === "number" && //만든시간
    typeof block.header.merkleRoot === "string" && //머클루트
    typeof block.body === "object"
  ); //body데이터
}

function isValidNewBlock(newBlock, previousBlock) {
  if (isValidBlockStructure(newBlock) === false) {
    //새로운블럭이 잘못만든 실패면
    console.log("invalid Block Structure");
    return false;
  } else if (newBlock.header.index !== previousBlock.header.index + 1) {
    //새로만든 블럭이랑 그전블럭에 인덱스가 같지않은면
    console.log("invalid index");
    return false;
  } else if (createHash(previousBlock) !== newBlock.header.previousHash) {
    //이전해시값 비교
    console.log("invalid previousHash");
    return false;
  } else if (
    (newBlock.body.length === 0 &&
      "0".repeat(64) !== newBlock.header.merkleRoot) ||
    (newBlock.body.length !== 0 &&
      merkle("sha256").sync(newBlock.body).root() !==
        newBlock.header.merkleRoot)
  ) {
    console.log("invalid merkleRoot");
    return false;
  }
  return true;
}

function addBlock(newBlock) {
  if (isValidNewBlock(newBlock, getLastBlock())) {
    console.log(33333333333333)
    console.log(newBlock)
    console.log(2222222222222)

    Blocks.push(newBlock);
    const difficultyBlock = getDifficulty(Blocks);
    console.log(77777777);
    console.log(difficultyBlock);
    console.log(88888888);
    
    return true;
  }
  return false;
}

module.exports = {
  addBlock,
  isValidNewBlock,
};
