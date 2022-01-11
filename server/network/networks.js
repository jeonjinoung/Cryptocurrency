/* P2P Server (노드와 노드 간의 통신) */
const WebSocket = require("ws");

//wsinit
function initP2PServer(test_port) {
  const server = new WebSocket.Server({ port: test_port });
  server.on("connection", (ws) => {
    initConnection(ws);
  });
  console.log("Listening webSocket port : " + test_port);
}

let sockets = [];

function initConnection(ws) {
  console.log(ws._socket.remotePort);
  sockets.push(ws);
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
    });
  });
}

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
};

function initMessageHandler(ws) {
  ws.on("message", (data) => {
    const message = JSON.parse(data);
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

function responseLatestMsg() {
  return {
    type: QUERY_LATEST,
    data: JSON.stringify([getLastBlock()]),
  };
}

function responseAllChainMsg() {
  return {
    type: RESPONSE_BLOCKCHAIN,
    data: JSON.stringify(getBlocks()),
  };
}

function handleBlockChainResponse(message) {
  const receiveBlocks = JSON.parse(message.data);
  const latestReceiveBlock = receiveBlocks[receiveBlocks.length - 1];
  const latestMyBlock = getLastBlock();

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

function queryAllMsg() {
  return {
    type: QUERY_ALL,
    data: null,
  };
}

function queryLatestMsg() {
  return {
    type: QUERY_LATEST,
    data: null,
  };
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