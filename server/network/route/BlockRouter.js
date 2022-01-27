const express = require("express");
const router = express.Router();
const Block = require("../../models/block");
const {
  getBlocks,
  getVersion,
  getLastBlock,
  // generatenextBlockWithTransaction,
  createNewBlock
} = require("../../blockchain/blocks");

// =============================================
//                /api/block
// =============================================

router.get("/blocks", (req, res) => {
  res.send(getBlocks());
});

router.get("/lastBlock", (req, res) => {
  res.send(getLastBlock());
});

router.post("/mineBlock", async (req, res) => {
  const newBlock = createNewBlock();
  res.send(newBlock);
});

router.get("/blocks/:hash", (req, res) => {
  const { hash } = req.params;
  const block = _.find(getBlocks(), { hash });
  if (block === undefined) {
    res.status(400).send("Block not found");
  } else {
    res.send(block);
  }
});

router.get("/version", (req, res) => {
  res.send(getVersion());
});

module.exports = router;
