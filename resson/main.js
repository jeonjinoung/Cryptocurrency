//22.01.05
//HTTP server초기화, p2p서버 server 초기화, 지갑 초기화,
//사용자와 노드간의 통신
//사용자가 블록체인 안에 있는 나의 노드 상태?

//main.js에서 함수를 가져다놓고 실행시킬거고
const fs = require("fs");
// const express = require("express");
// const bodyParser = require("body-parser");
const { getVersion, getBlocks, nextBlock } = require("./blockchain");
const { addBlock } = require("./utils");
const { connectToPeers, getSockets } = require("./network");
const { getPublicKeyFromWallet, initWallet } = require("./wallet");

// const http_port = process.env.HTTP_PORT || 3001;
//env | gerp HTTP_PORT 는 포트를 확인하는것 node창에 실행명령어
function initHttpServer() {
  const app = express();
  app.use(bodyParser.json());

  // curl -H "Content-type:application/json" --data "{\"data\" : [ \"ws://localhost:6002\", \"ws://localhost:6003\"] }"

  app.post("/addPeers", (req, res) => {
    const data = req.body.data || [];
    connectToPeers(data);
    res.send(data);
  });

  app.get("/peers", (req, res) => {
    let sockInfo = [];
    getSockets().forEach((s) => {
      sockInfo.push(s._socket.remoteAddress + ":" + s._socket.remotePort);
    });
    res.send(sockInfo);
  });

  app.get("/blocks", (req, res) => {
    res.send(getBlocks());
  });

  app.post("/mineBlock", (req, res) => {
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);

    res.send(block);
  });

  app.get("/version", (req, res) => {
    res.send(getVersion());
  });

  app.post("/stop", (req, res) => {
    res.send({ msg: "Stop Server!" });
    process.exit();
  });

  app.get("/address", (req, res) => {
    const address = getPublicKeyFromWallet().toString();
    if (address != "") {
      res.send({ address: address });
    } else {
      res.send("empty address!");
    }
    console.log(address);
  });

  app.listen(http_port, () => {
    console.log("Listening Http Port : " + http_port);
  });
}
initHttpServer();
//네트워크쪽에서
//initP2PServer();
//지갑은지갑쪽에서
initWallet();
