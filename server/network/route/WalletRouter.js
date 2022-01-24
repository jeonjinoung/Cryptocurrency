const express = require("express");
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

router.get("/addressSub", (req, res) => {
  console.log(req.body);
  const addressSub = getPublicKeyFromWalletSub().toString();
  if (addressSub != "") {
    res.send({ addressSub: addressSub });
  } else {
    res.send("empty address!");
  }
});

module.exports = router;
