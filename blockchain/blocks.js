const fs = require("fs");
const merkle = require("merkle");

const { Block, BlockHeader } = require("./blockchain");
const { createHash } = require("../utils/hash");
function getVersion() {
  const package = fs.readFileSync("package.json");
  //console.log(JSON.parse(package).version)
  return JSON.parse(package).version;
}
//getVersion 함수를 가져옴
//console.log(getVersion());
//함수를 가져와서 값이 안나옴
//console.log(getVersion);

//블럭은 생성되는 블럭함수
const block = createGenesisBlock();
//생성되는 블록함수 선언
function createGenesisBlock() {
  const version = getVersion();
  const index = 0;
  const previousHash = "0".repeat(64);
  const timestamp = 1231006505;
  const body = ["무기거래소 최초의 블럭"];
  const tree = merkle("sha256").sync(body);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = 0;
  const nonce = 0;

  const header = new BlockHeader(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce
  );
  return new Block(header, body);
}

//최초의 블럭 콘솔 실행
//console.log(block);

////////////////////////////////////////////////////////////////////////////////////////////
//블록체인 가져오기

//여러블럭을 선언 그리고 그값으로 생성된블럭들을 배열로 가져옴
let Blocks = [createGenesisBlock()];

//블럭을 얻는 함수선언
function getBlocks() {
  return Blocks;
}
//마지막 블럭 선언
function getLastBlock() {
  //마지막블럭은 블럭의 길이보다 하나 뺀다.
  return Blocks[Blocks.length - 1];
}

//블럭안에 내용을 해쉬값으로 변환후 출력
//const testHash = createHash(block);
//console.log(testHash); // d6c89a46d5abb32dcf912f011585aacdd321329dcdba26b2aad4f5d20184fa80 해쉬값으로 나옴

function nextBlock(bodyData) {
  const prevBlock = getLastBlock(); //이전블럭이 마지막 블럭이다.
  const version = getVersion(); // getVersion은 버전은 똑같다.
  const index = prevBlock.header.index + 1; //
  const previousHash = createHash(prevBlock);
  const timestamp = parseInt(Date.now() / 1000);
  const tree = merkle("sha256").sync(bodyData);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = 0;

  const header = new BlockHeader(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty
  );
  return new Block(header, bodyData);
  //뒷부분을 좀 바꿀꺼다.
}

function addBlock(bodyData) {
  const newBlock = nextBlock(bodyData);
  Blocks.push(newBlock);
}

addBlock(["transection1"]);
addBlock(["transection2"]);
addBlock(["transection3"]);
console.log(Blocks);

//최초의 블록 다음의 블럭이다.
// const block1 = nextBlock(["장거리무기"]);
// const block2 = nextBlock(["근접무기"]);
// console.log(block1, block2);

module.exports = { Blocks, getLastBlock, nextBlock, getBlocks, getVersion };

//const { Blocks, getLastBlock, createHash } = requrie("")

//const blockchain = [];

// 도구적인 기능을 하는 함수들 포함
function getCurrentTimestamp() {}

function getCurrentVersion() {}

function hexToBinary(s) {}

//지갑관련

//블록관련
