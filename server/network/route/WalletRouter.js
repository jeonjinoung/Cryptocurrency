const express = require("express");
const { generateRawNextBlock } = require("../../blockchain/blocks");
const router = express.Router();
const { getPublicKeyFromWallet } = require("../../wallet/wallet");
const { getPublicKeyFromWalletSub } = require("../../wallet/WalletSub");

// =============================================
//                /api/wallet
// =============================================

router.get("/address", (req, res) => {
  console.log(req.body);
  const address = getPublicKeyFromWallet().toString();
  if (address != "") {
    res.send({ address: address });
  } else {
    res.send("empty address!");
  }
});

router.post("/mineRawBlock", (req, res) => {
  if (req.body.data == null) {
    res.send('data 가 없습니다.');
    return;
  };
  
  const newBlock = generateRawNextBlock(req.body.data);
  if (newBlock == null) {
    res.status(400).send('could not generate block');
  } else {
    res.send(newBlock);
  };
});

module.exports = router;
