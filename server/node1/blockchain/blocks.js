const fs = require("fs");
const merkle = require("merkle");
const cryptojs = require('crypto-js');
const hexToBinary = require('hex-to-binary');
const _ = require("lodash");

const BLOCK_GENERATION_INTERVAL = 2  // 초단위
const DIFFICULTY_ADJUSMENT_INTERVAL = 3 // 블록이 생성되는 간격(난이도 간격)

const { Block, BlockHeader } = require("./blockclass");
const { processTransactions, createCoinbaseTx } = require("../trensection/transection");
const { getPublicKeyFromWallet, getBalance, generatePrivateKey, createTx, getPrivateKeyFromWallet } = require("../wallet/wallet");
const { getMempool, updateMempool, addToMempool } = require("../trensection/memPool");
const { createHash } = require("../utils/hash");

function getVersion() {
  const package = fs.readFileSync("package.json");
  return JSON.parse(package).version;
}

const genesisTx = {
  txIns: [{'signature': '', 'txOutId': '', 'txOutIndex': 0}],
  txOuts: [{
      'address': '04f418acec127da1708ee6ec32822fa21a1b643a2dec149a5329a50b19e1d3cffb680a4beed92349e6e0da1d1a1c8287e530ed9f116545cf68076800576d823460',
      'amount': 50
  }],
  id: '8aae310b2b7f350cc658503bac01fd1c4fd3e3a7ed475a19aaffd711db04c47a'
};

// 기존의 hash 값 안들어감
function createGenesisBlock() {
  const version = getVersion()
  const index = 0 
  const previousHash = '0'.repeat(64)
  const timestamp = 1231006505  // 2009/01/03 6:15pm (UTC)
  const body = [genesisTx]
  const tree = merkle('sha256').sync(body)
  const merkleRoot = tree.root() || '0'.repeat(64)
  const difficulty = 1 // O
  const nonce = 0 // O

  const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce)

  return new Block(header, body)
}

let Blocks = [createGenesisBlock()];

// 초기 절차
let unspentTxOuts = processTransactions(Blocks[0].body, [], 0);

function getLastBlock() {
  return Blocks[Blocks.length - 1];
}

function getCurrentTimestamp() {
  return Math.round(new Date().getTime() / 1000);
}

function getBlocks() {
  return Blocks;
}

function calcurateHash(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, nonce) {
  const blockString = currentVersion + nextIndex + previousHash + nextTimestamp + merkleRoot + difficulty + nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
};

const createNewBlock = () => {
  const coinbaseTx = createCoinbaseTx(
    getPublicKeyFromWallet(),
    getLastBlock().header.index + 1,
  );
  const blockData = [coinbaseTx].concat(getMempool());
  return createNewRawBlock(blockData);
};

const createNewRawBlock = (blockData) => {
  const { broadcastLatest } = require("../network/networks");

  const previousBlock = getLastBlock();
  const version = getVersion();
  const newBlockIndex = previousBlock.header.index + 1;
  const newTimestamp = getCurrentTimestamp();
  const previousHash = createHash(previousBlock);
  const tree = merkle('sha256').sync(blockData)
  const merkleRoot = tree.root() || '0'.repeat(64)
  const difficulty = findDifficulty();
  const newBlock = findBlock(
    version,
    newBlockIndex,
    previousHash,
    newTimestamp,
    merkleRoot,
    difficulty,
    blockData,
  );
  addBlockToChain(newBlock);
  broadcastLatest();
  return newBlock;
};

const findDifficulty = () => {
  const newestBlock = getLastBlock();
  if (
    newestBlock.header.index % DIFFICULTY_ADJUSMENT_INTERVAL === 0 &&
    newestBlock.header.index !== 0
  ) {
    return calculateNewDifficulty(newestBlock, getBlocks());
  } else {
    return newestBlock.header.difficulty;
  }
};

const calculateNewDifficulty = (newestBlock, blockchain) => {
  const lastCalculatedBlock =
    blockchain[blockchain.length - DIFFICULTY_ADJUSMENT_INTERVAL];
  const timeExpected =
    BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSMENT_INTERVAL;
  const timeTaken = newestBlock.header.timestamp - lastCalculatedBlock.header.timestamp;
  if (timeTaken < timeExpected / 2) {
    return lastCalculatedBlock.header.difficulty + 1;
  } else if (timeTaken > timeExpected * 2) {
    return lastCalculatedBlock.header.difficulty - 1;
  } else {
    return lastCalculatedBlock.header.difficulty;
  }
};

function findBlock(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, blockData) {
  let nonce = 0;
  
  while(true) {
    let hash = calcurateHash(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, nonce);

    if (hashMatchesDifficulty(hash, difficulty)) {
      const header = new BlockHeader(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, nonce);
      return new Block(header, blockData);
    };
    nonce++;
  };
};

function hashMatchesDifficulty(hash, difficulty) {
  const hashBinary = hexToBinary(hash).substring(0, difficulty);
  return hashBinary.startsWith('0'.repeat(difficulty))
};

function isValidTimestamp(newBlock, previousBlock) {
  return (
    previousBlock.header.timestamp - 60 < newBlock.header.timestamp &&
    newBlock.header.timestamp - 60 < getCurrentTimestamp()
  );
};

const isChainValid = (candidateChain) => {
  const { isValidNewBlock } = require('../utils/isValidBlock'); 

  const isGenesisValid = (block) => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };

  if (!isGenesisValid(candidateChain[0])) {
    console.log(
      "The candidateChains's genesisBlock is not the same as our genesisBlock"
    );
    return null;
  }

  let foreignUTxOuts = [];

  for (let i = 0; i < candidateChain.length; i++) {
    const currentBlock = candidateChain[i];
    if (i !== 0 && !isValidNewBlock(currentBlock, candidateChain[i - 1])) {
      return null;
    }

    foreignUTxOuts = processTransactions(
      currentBlock.body,
      foreignUTxOuts,
      currentBlock.header.index
    );

    if (foreignUTxOuts === null) {
      return null;
    }
  }
  return foreignUTxOuts;
};

const sumDifficulty = (anyBlockchain) =>{
  anyBlockchain
    .map(block => block.header.difficulty)
    .map(difficulty => Math.pow(2, difficulty))
    .reduce((a, b) => a + b);
};

const replaceChain = (candidateChain) => {
  const { broadcastLatest } = require("../network/networks");

  const foreignUTxOuts = isChainValid(candidateChain);
  const validChain = foreignUTxOuts !== null;
  if (validChain && sumDifficulty(candidateChain) > sumDifficulty(getBlocks())) {
    Blocks = candidateChain;
    unspentTxOuts = foreignUTxOuts;
    updateMempool(unspentTxOuts);
    broadcastLatest();
    return true;
  } else {
    return false;
  }
};

const addBlockToChain = (candidateBlock) => {
  const { isValidNewBlock } = require('../utils/isValidBlock'); 
  
  console.log(444444444444444444444444444444444);
  console.log(candidateBlock);
  console.log(444444444444444444444444444444444);
  if (isValidNewBlock(candidateBlock, getLastBlock())) {
    const processedTxs = processTransactions(
      candidateBlock.body,
      unspentTxOuts,
      candidateBlock.header.index,
    );
    if (processedTxs === null) {
      console.log("Couldnt process txs");
      return false;
    } else {
      Blocks.push(candidateBlock);
      unspentTxOuts = processedTxs;
      updateMempool(unspentTxOuts);
      return true;
    }
    return true;
  } else {
    return false;
  }
};

const getUTxOutList = () => _.cloneDeep(unspentTxOuts);

const getAccountBalance = () => getBalance(getPublicKeyFromWallet(), unspentTxOuts);

const sendTx = (address, amount) => {
  // 여기서 전달 받은 address 인자는 받는 주소
  const tx = createTx(
    address,
    amount,
    getPrivateKeyFromWallet(),
    getUTxOutList(),
    getMempool()
  );
  addToMempool(tx, getUTxOutList());
  // broadcastMempool();
  return tx;
};

const handleIncomingTx = tx => {
  addToMempool(tx, getUTxOutList());
};

module.exports = {
  getLastBlock,
  getBlocks,
  createNewBlock,  
  getVersion,
  addBlockToChain,
  isValidTimestamp,
  hashMatchesDifficulty,
  replaceChain,
  getAccountBalance,
  sendTx,
  handleIncomingTx,
  getUTxOutList,
};