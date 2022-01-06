/* HTTP Server (사용자와 노드 간의 통신) */
const express = require("express");
const { getBlocks, getVersion, nextBlock } = require("../blockchain/blocks");
const { addBlock } = require("../utils/isValidBlock");
const http_port = process.env.HTTP_PORT || 3001;

function initHttpServer() {
  const app = express();
  app.use(express.json());

  app.get("/blocks", (req, res) => {
    res.send(getBlocks());
  });

  app.get("/version", (req, res) => {
    res.send(getVersion());
  });

  app.post("/mineBlock", (req, res) => {
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);

    res.send(block);
  });

  app.post("/stop", (req, res) => {
    res.send({ msg: "Stop Server!" });
    process.exit();
  });

  app.listen(http_port, () => {
    console.log("Listening Http Port : " + http_port);
  });
}

initHttpServer();

// function initHttpServer() {}

// initHttpServer();
// initP2PServer();
// initWallet();
