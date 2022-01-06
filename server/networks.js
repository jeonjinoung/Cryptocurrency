/* P2P Server (노드와 노드 간의 통신) */
const p2p_port = process.env.P2P_PORT || 6001;

const WebSocket = require("ws");

//wsinit
function initP2PServer(test_port) {
  const server = new WebSocket.Server({ port: test_port });
  //console.log(server);
  server.on("connection", (ws) => {
    initConnection(ws);
  });
  console.log("Listening webSocket port : " + test_port);
}

initP2PServer(6001);
initP2PServer(6002);
initP2PServer(6003);

let sockets = [];

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

function initConnection(ws) {
  //console.log(ws._socket.remotePort)
  sockets.push(ws);
}

module.exports = {
  sockets,
  getSockets,
  broadcast,
  connectToPeers,
  initConnection,
};
// const MessageType = {};

// const sockets = [];

// function initP2PServer() {}
