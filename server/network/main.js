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
    console.log(11111);
    console.log(req.body);
    console.log(33333);
    
    // const data = req.body.data || [];
    // connectToPeers(data);
    // res.send(data);
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
    // broadcast(block);
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

/*
누구나 서버가 되기도하고 클라이언트가 되기도하면서 메세지를 보내고 받아야되는 소켓형태가 되어야한다.

여러 명령어가 필요 블록을 생성할때 쓰는 명령어
curl -H "Content-type:application/json" --data "{\"data\" : [\"Anyting1\", \"Anyting2\"]}" http://localhost:3001/mineBlock

만들어낸 블록을 보려면
curl -X GET http://localhost:3001/blocks\

json형태로 좀더 편하게 가지고오고싶다면
curl -X GET http://localhost:3001/blocks | python3 -m json.tool

그리고 우리의 버전을 확인하고싶다면
curl -X GET http://localhost:3001/version

그리고 우리가 추가의 피어를 만들어서 소켓을 만들어주려면 웹소켓을 만들어주고
curl -H "Content-type:application/json" --data "{\"data\" : [ \"ws://localhost:7002\", \"ws://localhost:7003\"] }" http://localhost:4001/addPeers

만들어준 웹소켓의 피어를 불러오려면
curl -X GET http://localhost:4001/peers
이렇게 하면된다는데?

서버를 ctrl + c 말고 원격으로 끄게만드려면? / server.js 코드 추가 -> server 쪽에 코드를 수정 or 추가할 시에는 꼭 server를 껐다가 켜야함 !!!!!!* 
curl http://localhost:3001/stop

소켓을 만들고 모듈을 사용하려면
npm i ws
*/
