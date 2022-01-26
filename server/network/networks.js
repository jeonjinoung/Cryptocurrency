const WebSocket = require("ws");
const { getLastBlock, replaceChain, handleIncomingTx } = require("../blockchain/blocks");
const { getMempool } = require("../trensection/memPool");
const { createHash } = require("../utils/hash");
const { responseLatestMsg, responseAllChainMsg, queryAllMsg, queryLatestMsg, getAllMempool, mempoolResponse } = require("./massage/massage");
const { MessageType, MemPoolMessageType } = require("./massage/type");

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

function getSockets() {
  return sockets;
}

function initConnection(ws) {
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryLatestMsg());

  setTimeout(() => {
    broadcast(getAllMempool()); // changed line
  }, 1000);
  setInterval(() => {
    if (sockets.includes(ws)) {
      write(ws, "");
    }
  }, 1000);
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
        // ??message.body;??massage???
        const receivedBlocks = message.data;
        if (receivedBlocks === null) {
          break;
        }
        handleBlockChainResponse(receivedBlocks);
        break;
      case MemPoolMessageType.REQUEST_MEMPOOL:
        write(ws, returnMempool());
        break;
      case MemPoolMessageType.MEMPOOL_RESPONSE:
        // ??message.data;??
        const receivedTxs = message.data;
        if (receivedTxs === null) {
          return;
        }
        receivedTxs.forEach(tx => {
          try {
            handleIncomingTx(tx);
            broadcastMempool();
          } catch (e) {
            console.log(e);
          }
        });
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

const returnMempool = () => mempoolResponse(getMempool());

function write(ws, message) {
  ws.send(JSON.stringify(message));
}

function broadcast(message) {
  sockets.forEach((socket) => {
    write(socket, message);
  });
}

const broadcastLatest = () => broadcast(responseLatestMsg());

const broadcastMempool = () => broadcast(returnMempool());

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

module.exports = {
  connectToPeers,
  getSockets,
  initConnection,
  initMessageHandler,
  initP2PServer,
  broadcast,
  handleBlockChainResponse,
  broadcastLatest,
  broadcastMempool,
};
