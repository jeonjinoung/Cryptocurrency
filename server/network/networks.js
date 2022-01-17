/* P2P Server (노드와 노드 간의 통신) */
const WebSocket = require("ws");
const {
  getLastBlock,
  getBlocks,
  replaceChain,
} = require("../blockchain/blocks");
const { createHash } = require("../utils/hash");

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
console.log(5555555555555555555555555);
function connectToPeers(newPeers) {
  console.log(66666666666666666666666666);
  newPeers.forEach((peer) => {
    console.log(777777777777777777777777);
    const ws = new WebSocket(peer);
    console.log(8888888888888888888888888888);
    console.log(ws);
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

    console.log(
      message.type,
      message.type,
      message.type,
      message.type,
      message.type
    );
    console.log(message);
    console.log(
      message.type,
      message.type,
      message.type,
      message.type,
      message.type
    );

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

function responseLatestMsg() {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify([getLastBlock()]),
  };
}

function responseAllChainMsg() {
  console.log("블록 보내기");
  console.log(getBlocks());
  console.log("블록 보내기");
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify(getBlocks()),
  };
}

function handleBlockChainResponse(message) {
  const { addBlock } = require("../utils/isValidBlock");

  console.log("받은 데이터");
  console.log(JSON.parse(message.data));
  console.log("받은 데이터");
  const receiveBlocks = JSON.parse(message.data);
  const latestReceiveBlock = receiveBlocks[receiveBlocks.length - 1];
  const latestMyBlock = getLastBlock();

  if (receiveBlocks.length === 0) {
    console.log("받은 블록체인이 존재하지 않습니다.");
    return;
  }

  /* 두 블록체인의 길이 비교 */
  if (latestReceiveBlock.header.index > latestMyBlock.header.index) {
    if (createHash(latestMyBlock) === latestReceiveBlock.header.previousHash) {
      if (addBlock(latestReceiveBlock)) {
        console.log("가즈아");
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
    type: MessageType.QUERY_ALL,
    data: null,
  };
}

/* 연결 되자마자 처음 보냄 */
function queryLatestMsg() {
  return {
    type: MessageType.QUERY_LATEST,
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
  responseLatestMsg,
};
