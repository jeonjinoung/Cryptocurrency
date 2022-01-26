const fs = require('fs');
const ecdsa = require('elliptic');
const { TxOut, TxIn, Transaction, getPublicKey, getTransactionId, signTxIn } = require('../trensection/transection');
const ec = new ecdsa.ec("secp256k1");
const _ = require("lodash");

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key";

function initWallet() {
  if (fs.existsSync(privateKeyFile)) {
    console.log("기존 지갑 private key 경로 : " + privateKeyFile);
    return;
  };

  if (!fs.existsSync("wallet/")) {
    fs.mkdirSync("wallet/")
  };

  if (!fs.existsSync(privateKeyLocation)) {
    fs.mkdirSync(privateKeyLocation)
  };

  const newPrivateKey = generatePrivateKey();
  fs.writeFileSync(privateKeyFile, newPrivateKey);
  console.log("새로운 지갑 생성 private key 경로 : " + privateKeyFile);
};

initWallet();

function generatePrivateKey() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

function getPrivateKeyFromWallet() {
  const buffer = fs.readFileSync(privateKeyFile, "utf-8");
  return buffer.toString();
};

function getPublicKeyFromWallet() {
  const privateKey = getPrivateKeyFromWallet();
  const key = ec.keyFromPrivate(privateKey, "hex");
  return key.getPublic().encode("hex");
};

const getBalance = (address, uTxOuts) => {
  console.log("----------- 1 . 검색할 주소 값 -----------");
  console.log(address);
  console.log("----------- 2 . unspentTxOuts 값 -----------");
  console.log(uTxOuts);
  console.log("----------- 출력완료 -----------");

  return _(uTxOuts)
    .filter(uTxO => uTxO.address === address)
    .map(uTxO => uTxO.amount)
    .sum();
};

const findAmountInUTxOuts = (amountNeeded, myUTxOuts) => {
  console.log("----------- 3. 금액과 memPool -----------");
  console.log(amountNeeded);
  console.log(myUTxOuts);
  console.log("----------- 받은 인자 -----------");

  let currentAmount = 0;
  const includedUTxOuts = [];
  for (const myUTxOut of myUTxOuts) {
    includedUTxOuts.push(myUTxOut);
    currentAmount = currentAmount + myUTxOut.amount;
    if (currentAmount >= amountNeeded) {
      const leftOverAmount = currentAmount - amountNeeded;
      return { includedUTxOuts, leftOverAmount };
    };
  };
  throw Error("Not enough founds");
};

const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount) => {
  // 받는 주소랑 금액
  const receiverTxOut = new TxOut(receiverAddress, amount);
  if (leftOverAmount === 0) {
    // 잔액 없으면 결과반환
    return [receiverTxOut];
  } else {
    // leftOver 는 본인 - receiver 는 상대의 TxOut 
    const leftOverTxOut = new TxOut(myAddress, leftOverAmount);
    return [receiverTxOut, leftOverTxOut];
  };
};

const filterUTxOutsFromMempool = (uTxOutList, mempool) => {
  const txIns = _(mempool)
    .map(tx => tx.txIns)
    .flatten()
    .value();

  const removables = [];

  for (const uTxOut of uTxOutList) {
    const txIn = _.find(
      txIns,
      txIn =>
        txIn.txOutIndex === uTxOut.txOutIndex && txIn.txOutId === uTxOut.txOutId
    );
    if (txIn !== undefined) {
      removables.push(uTxOut);
    };
  };

  return _.without(uTxOutList, ...removables);
};

const createTx = (receiverAddress, amount, privateKey, uTxOutList, memPool) => {
  console.log(privateKey);
  const myAddress = getPublicKey(privateKey);
  console.log(uTxOutList);
  const myUTxOuts = uTxOutList.filter(uTxO => uTxO.address === myAddress);

  console.log("----------- 1. 내 거래 찾기 myUTxOuts -----------");
  console.log(myUTxOuts);
  const filteredUTxOuts = filterUTxOutsFromMempool(myUTxOuts, memPool);

  console.log("----------- 2. memPool 에서 찾음 (금액과 memPool 에서의 찾은 값 전달) -----------");
  console.log(filteredUTxOuts);
  
  const { includedUTxOuts, leftOverAmount } = findAmountInUTxOuts(
    amount,
    filteredUTxOuts
  );
  console.log("----------- 4. 정산 후 반환된 2가지의 값 -----------");
  console.log(includedUTxOuts);
  console.log(leftOverAmount);

  console.log("----------- 5. txIn 의 이전 OutPut 참조 (txIn) -----------");
  // txIn 의 이전 OutPut 참조
  const toUnsignedTxIn = (uTxOut) => {
    const txIn = new TxIn();
    txIn.txOutId = uTxOut.txOutId;
    txIn.txOutIndex = uTxOut.txOutIndex;

    console.log(txIn);
    return txIn;
  };
  // console.log("----------- 5. txIn 의 이전 OutPut 참조 (txOutId) -----------");
  console.log(toUnsignedTxIn.toUnsignedTxIn);

  // console.log("----------- 6. txIn 의 이전 OutPut 참조 (txOutIndex) -----------");
  // console.log(toUnsignedTxIn);

  // 서명 전
  const unsignedTxIns = includedUTxOuts.map(toUnsignedTxIn);
  console.log("----------- 서명 전!!!! -----------");
  console.log(unsignedTxIns);
  console.log("----------- 서명 전!!!! -----------");

  const tx = new Transaction();
  tx.txIns = unsignedTxIns;
  // 받는 주소 - 나의 주소 - 보내는 금액 - 남은금액
  tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
  // 위의 createTxOuts 로 반환되는 것들은 보낸이 받는이의 2개의 배열 Output 들
  tx.id = getTransactionId(tx);
  
  console.log("----------- 서명 전 tx!! -----------");
  console.log(tx);
  console.log("----------- 서명 전 tx!! -----------");

  console.log("signTxIn - 이곳예정");
  tx.txIns = tx.txIns.map((txIn, index) => {
    txIn.signature = signTxIn(tx, index, privateKey, uTxOutList);
    return txIn;
  });
  console.log("----------- 서명 tx 완료!! -----------");
  console.log(tx);
  console.log("----------- 서명 tx 완료!! -----------");

  return tx;
};

module.exports = {
  getPublicKeyFromWallet,
  getBalance,
  generatePrivateKey,
  createTx,
  getPrivateKeyFromWallet,
};