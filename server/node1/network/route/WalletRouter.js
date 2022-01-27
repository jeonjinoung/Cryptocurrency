const express = require("express");
const router = express.Router();
const { getPublicKeyFromWallet } = require("../../wallet/wallet");

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

module.exports = router;
