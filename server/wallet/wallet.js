// 비밀키와 공개키를 관리
/* 
  지갑에서부터 비밀키를 가져오거나 공개키를 생성
  새로운 비밀키를 생서하거나 있으면 기존 파일에서 읽어오는 기능
*/

const fs = require("fs");
const ecdsa = require("elliptic"); // 타원 곡선 디지털 서명 알고리즘
const ec = new ecdsa.ec("secp256k1");

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key";

function initWallet() {
  if (fs.existsSync(privateKeyFile)) {
    //console.log("기존 지갑 private key 경로 : " + privateKeyFile);
    return;
  }

  if (!fs.existsSync("wallet/")) {
    fs.mkdirSync("wallet/");
  }

  if (!fs.existsSync(privateKeyLocation)) {
    fs.mkdirSync(privateKeyLocation);
  }

  const newPrivateKey = generatePrivateKey();
  fs.writeFileSync(privateKeyFile, newPrivateKey);
  console.log("새로운 지갑 생성 private key 경로 : " + privateKeyFile);
}

initWallet();

function generatePrivateKey() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
}

function getPrivateKeyFromWallet() {
  const buffer = fs.readFileSync(privateKeyFile, "utf-8");
  return buffer.toString();
}

function getPublicKeyFromWallet() {
  const privateKey = getPrivateKeyFromWallet();
  const key = ec.keyFromPrivate(privateKey, "hex");
  return key.getPublic().encode("hex");
}

const findTxOutsForAmount = (amount, myUnspentTxOuts) => {
  let currentAmount = 0;
  const includedUnspentTxOuts = [];
  for (const myUnspentTxOut of myUnspentTxOuts) {
    includedUnspentTxOuts.push(myUnspentTxOut);
    currentAmount = currentAmount + myUnspentTxOut.amount;
    if (currentAmount >= amount) {
      const leftOverAmount = currentAmount - amount;
      console.log("incudedUnspenTxOuts : ", incudedUnspenTxOuts);
      console.log("leftOverAmount : ", leftOverAmount);
      return { includedUnspentTxOuts, leftOverAmount };
    }
  }
  throw Error("not enough coins to send transaction");
};

const toUnsignedTxin = (myUnspentTxOut) => {
  const txin = new TxIn();
  txin.txOutId = myUnspentTxOut.txOutId;
  txin.txOutindex = myUnspentTxOut.txOutindex;
  console.log("txin : ", txin);
  return txin;
};
const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(amount, myUnspentTxout);

const unsignedTxins = includedUnspentTxOuts.map(toUnsignedTxin);

const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount) => {
  const txOut1 = new txOut(receiverAddress, amount);
  if (leftOverAmount === 0) {
    return [txOut1];
  } else {
    const leftOberTx = new TxOut(myAddress, leftOverAmount);
    return [txOut1, leftOberTx];
  }
};

const tx = new Transaction();
tx.txins = unsignedTxins;
tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
tx.id = getTransactionld(tx);
console.log(tx.txins);
console.log(tx.txOuts);
console.log(tx.id);

tx.txins = tx.txins.map((txin, index) => {
  txin.signature = signTxin(tx, index, privateKey, unspentTxOuts);
  return txin;
});

console.log(tx.txins);

module.exports = {
  getPublicKeyFromWallet,
};
