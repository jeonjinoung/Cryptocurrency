const express = require("express");
const { generateRawNextBlock, sendTx, getAccountBalance, getBlocks, getUTxOutList } = require("../../blockchain/blocks");
const { getMempool } = require("../../trensection/memPool");
const router = express.Router();
const { getPublicKeyFromWallet, getBalance } = require("../../wallet/wallet");
const _ = require("lodash");

// =============================================
//                /api/wallet
// =============================================

// router.get("/address", (req, res) => {
//   const address = getPublicKeyFromWallet().toString();
//   if (address != "") {
//     res.send({ address: address });
//   } else {
//     res.send("empty address!");
//   }
// });

router.get("/balance", (req, res) => {
  const balance = getAccountBalance();
  console.log(balance);
  res.send({ balance });
});

router.get("/address", (req, res) => {
  res.send(getPublicKeyFromWallet());
});

router.get("/transactions/:id", (req, res) => {
  const tx = _(getBlocks())
    .map(blocks => blocks.body)
    .flatten()
    .find({ id: req.params.id });
  if (tx === undefined) {
    res.status(400).send("Transaction not found");
  }
  res.send(tx);
});

router.get("/transactions", (req, res) => {
  res.send(getMempool());
});

router.post("/addtransactions", (req, res) => {
  try {
    const { address, amount } = req.body;
    if (address === undefined || amount === undefined) {
      throw Error("Please specify and address and an amount");
    } else {
      console.log("----------- 0. 시작 -----------");
      const resPonse = sendTx(address, amount);
      res.send(resPonse);
    }
  } catch (e) {
    res.status(400).send(e.message);
  };
});

router.get("/address/:address", (req, res) => {
  const { address } = req.params;
  const balance = getBalance(address, getUTxOutList());
  res.send({ balance });
});

module.exports = router;
