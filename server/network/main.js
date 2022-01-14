/* HTTP Server (사용자와 노드 간의 통신) */
const express = require("express");
const { getBlocks, getVersion, nextBlock, getLastBlock } = require("../blockchain/blocks");
const { getPublicKeyFromWallet } = require("../wallet/wallet");
const { connectToPeers, getSockets, initP2PServer, broadcast } = require("./networks");
const { work } = require('../scripts/average-work');

const HTTP_PORT = process.env.HTTP_PORT || 4001;
const P2P_PORT = process.env.P2P_PORT || 7001;

function initHttpServer() {
  const app = express();
  app.use(express.json());

  app.post("/api/addPeers", (req, res) => {
    const data = req.body.data || [];
    connectToPeers(data);
    res.send(data);
  });

  app.get("/api/peers", (req, res) => {
    let sockInfo = [];
    getSockets().forEach((s) => {
      sockInfo.push(s._socket.remoteAddress + ":" + s._socket.remotePort);
    });
    res.send(sockInfo);
  });

  app.get("/api/blocks", (req, res) => {
    res.send(getBlocks());
  });

  app.get("/api/lastBlock", (req, res) => {
    res.send(getLastBlock());
  });

  app.post("/api/mineBlock", (req, res) => {
    const { addBlock } = require("../utils/isValidBlock");
    // work();
    
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);
    res.send(block);
  });

  app.get("/api/version", (req, res) => {
    res.send(getVersion());
  });

  app.post("/api/stop", (req, res) => {
    res.send({ msg: "Stop Server!" });
    process.exit();
  });

  app.get("/api/address", (req, res) => {
    const address = getPublicKeyFromWallet().toString();
    if (address != "") {
      res.send({"address" : address});
    } else {
      res.send("empty address!");
    }
  });

  app.listen(HTTP_PORT, () => {
    console.log("Listening Http Port : " + HTTP_PORT);
  });
}

initHttpServer();
initP2PServer(P2P_PORT);