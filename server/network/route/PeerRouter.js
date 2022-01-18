const express = require("express");
const router = express.Router();
const {
  connectToPeers,
  getSockets,
} = require("../../network/networks");

// =============================================
//                /api/peer
// =============================================

router.post("/addPeers", (req, res) => {
  const data = req.body.data || [];
  connectToPeers(data);

  const peerNumber = data[0].split(':');
  return res.json({ peer: peerNumber[2] });
});

router.get("/peers", (req, res) => {
  let sockInfo = [];
  getSockets().forEach((s) => {
    sockInfo.push(s._socket.remoteAddress + ":" + s._socket.remotePort);
  });
  res.status(200).json({ peer: sockInfo, success: true });
});

module.exports = router;