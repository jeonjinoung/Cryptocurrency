const express = require("express");
const router = express.Router();
const { getPublicKeyFromWallet } = require("../../wallet/wallet");

// =============================================
//                /api/wallet
// =============================================
console.log(77777777777777777);
router.get("/address", (req, res) => {
  console.log(88888888888888888888);
  console.log(req.body);
  const address = getPublicKeyFromWallet().toString();
  if (address != "") {
    res.send({ address: address });
  } else {
    res.send("empty address!");
  }
});

module.exports = router;
