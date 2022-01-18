const express = require("express");
const router = express.Router();
const {
  getBlocks,
  getVersion,
  nextBlock,
  getLastBlock,
} = require("../../blockchain/blocks");
const { addBlock } = require("../../utils/isValidBlock");
const { broadcast } = require("../networks");
const { responseLatestMsg } = require("../massage/massage");

// =============================================
//                /api/block
// =============================================

router.get("/blocks", (req, res) => {
  res.send(getBlocks());
});

router.get("/lastBlock", (req, res) => {
  res.send(getLastBlock());
});

router.post("/mineBlock", (req, res) => {
  const data = req.body.data || [];
  const block = nextBlock(data);
  addBlock(block);
  console.log(111111111111111);
  broadcast(responseLatestMsg());
  console.log(666666666666666);

  res.send(block);
});

router.get("/version", (req, res) => {
  res.send(getVersion());
});

module.exports = router;