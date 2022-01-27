const express = require("express");
const router = express.Router();
const { getPublicKeyFromWallet } = require("../../wallet/wallet");
const { getPublicKeyFromWalletSub } = require("../../wallet/WalletSub");
const Address = require("../../models/address");

// =============================================
//                /api/wallet
// =============================================

router.get("/address", async (req, res) => {
  const address = getPublicKeyFromWallet().toString();
  try{
    const key = await Address.findOne({where:{address}})
    if (key){
      return res.redirect('/""/Dashboard')
    } else if (address != "") {
      res.send({ address: address });
    } else if(address = ""){
      res.send("empty address!");
    }  await Address.create({
      address:address
    })
  } 
finally{
  
}})

router.get("/addressSub", async (req, res) => {
  const addressSub = getPublicKeyFromWalletSub().toString();
  try{
    const keySub = await Address.findOne({where:{address:addressSub}})
    if (keySub){
      return res.redirect('/""/Dashboard')
    } else if (addressSub != "") {
      res.send({ addressSub: addressSub });
    } else {
      res.send("empty address!");
    } await Address.create({
      address:addressSub
    })
  }
  finally{

  }
});

module.exports = router;
