const express = require("express");
const router = express.Router();
const Block = require("../../models/block");
const {
  getBlocks,
  getVersion,
  nextBlock,
  getLastBlock,
  generatenextBlockWithTransaction
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

router.post("/mineBlock", async (req, res) => {
  const data = req.body.data || [];
  const block = nextBlock(data);
  addBlock(block);
  console.log(block)
  broadcast(responseLatestMsg());
  res.send(block);
  const { previousHash, timestamp, merkleRoot, difficulty, nonce } =
    block.header;
  await Block.create({
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce,
    body: block.body[0],
  });
});

router.post('/mineTransaction', (req, res) => {
  const address = req.body.address;
  const amount = req.body.amount;
  try {
      const resp = generatenextBlockWithTransaction(address, amount);
      res.send(resp);
  } catch (e) {
      console.log(e.message);
      res.status(400).send(e.message);
  }
});

router.get("/version", (req, res) => {
  res.send(getVersion());
});

module.exports = router;
