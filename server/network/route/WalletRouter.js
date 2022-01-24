const express = require("express");
const router = express.Router();
const { getPublicKeyFromWallet } = require("../../wallet/wallet");
const { getPublicKeyFromWalletSub } = require("../../wallet/WalletSub");
const Address = require("../../models/address");

// =============================================
//                /api/wallet
// =============================================

router.get("/address", async (req, res) => {
  console.log(req.body);
  const address = getPublicKeyFromWallet().toString();
  if (address != "") {
    res.send({ address: address });
  } else {
    res.send("empty address!");
  } await Address.create({
    address:address
  })
});

router.get("/addressSub", async (req, res) => {
  console.log(req.body);
  const addressSub = getPublicKeyFromWalletSub().toString();
  if (addressSub != "") {
    res.send({ addressSub: addressSub });
  } else {
    res.send("empty address!");
  } await Address.create({
    address:addressSub
  })
});

module.exports = router;
