// P2P서버 관련 내용 - 메세지 핸들러, 에러 핸들러, 브로드캐스트 등
// (노드와 노드 간의 통신)

const WebSocket = require("ws");

const p2p_port = process.env.P2P_PORT || 6001;

let sockets = [];

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

function initConnection(ws) {
  //console.log(ws._socket.remotePort)
  sockets.push(ws);
}

// const MessageType = {};

// const sockets = [];

// function initP2PServer() {}
