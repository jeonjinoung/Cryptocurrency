const WebSocket = require("ws");
const {
  getLastBlock,
  replaceChain,
} = require("../blockchain/blocks");
const { createHash } = require("../utils/hash");
const { responseLatestMsg, responseAllChainMsg, queryAllMsg, queryLatestMsg } = require("./massage/massage");
const { MessageType } = require("./massage/type");

function initP2PServer(test_port) {
  const server = new WebSocket.Server({ port: test_port });
  server.on("connection", (ws) => {
    initConnection(ws);
  });
  server.on("error", () => {
    console.log("error");
  });
  console.log("Listening webSocket port : " + test_port);
}

let sockets = [];

function initConnection(ws) {
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryLatestMsg());
}

function getSockets() {
  return sockets;
}

function write(ws, message) {
  ws.send(JSON.stringify(message));
}

function broadcast(message) {
  sockets.forEach((socket) => {
    write(socket, message);
  });
}

function connectToPeers(newPeers) {
  newPeers.forEach((peer) => {
    const ws = new WebSocket(peer);
    ws.on("open", () => {
      console.log("open");
      initConnection(ws);
    });
    ws.on("error", (errorType) => {
      console.log("connetion Failed!" + errorType);
      return false;
    });
  });
}

function initMessageHandler(ws) {
  ws.on("message", (data) => {
    const message = JSON.parse(data);

    if (message === null) {
      return;
    }

    switch (message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg());
        break;
      case MessageType.QUERY_ALL:
        write(ws, responseAllChainMsg());
        break;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBlockChainResponse(message);
        break;
    }
  });
}

function handleBlockChainResponse(message) {
  const { addBlock } = require("../utils/isValidBlock");

  const receiveBlocks = JSON.parse(message.data);
  const latestReceiveBlock = receiveBlocks[receiveBlocks.length - 1];
  const latestMyBlock = getLastBlock();

  if (receiveBlocks.length === 0) {
    console.log("받은 블록체인이 존재하지 않습니다.");
    return;
  }

  if (latestReceiveBlock.header.index > latestMyBlock.header.index) {
    if (createHash(latestMyBlock) === latestReceiveBlock.header.previousHash) {
      if (addBlock(latestReceiveBlock)) {
        broadcast(responseLatestMsg());
      } else {
        console.log("Invaild Block!!");
      }
    } else if (receiveBlocks.length === 1) {
      broadcast(queryAllMsg());
    } else {
      replaceChain(receiveBlocks);
    }
  } else {
    console.log("Do nothing.");
  }
}

function initErrorHandler(ws) {
  ws.on("close", () => {
    closeConnection(ws);
  });
  ws.on("error", () => {
    closeConnection(ws);
  });
}

function closeConnection(ws) {
  console.log(`Connection close${ws.url}`);
  sockets.splice(sockets.indexOf(ws), 1);
}

module.exports = {
  connectToPeers,
  getSockets,
  initConnection,
  initMessageHandler,
  initP2PServer,
  broadcast,
  handleBlockChainResponse,
};
