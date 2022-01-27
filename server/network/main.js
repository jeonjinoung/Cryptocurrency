const express = require("express");
const path = require("path");
const { sequelize } = require("../models/index");
const passport = require("passport");
const passportConfig = require("../passport");
const app = express();
const morgan = require("morgan")
const { initP2PServer } = require("./networks");
const UserRouter = require('./route/UserRouter');
const PeerRouter = require('./route/PeerRouter');
const BlockRouter = require('./route/BlockRouter');
const WalletRouter = require('./route/WalletRouter');

const HTTP_PORT = process.env.HTTP_PORT || 4000;
const P2P_PORT = process.env.P2P_PORT || 7000;

function initHttpServer() {  
  passportConfig();
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("데이터베이스 연결성공");
    })
    .catch((err) => {
      console.error(err);
    });
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan("combined"));
  app.use(passport.initialize());

  app.use("/api/user", UserRouter);
  app.use("/api/peer", PeerRouter);
  app.use("/api/block", BlockRouter);
  app.use("/api/wallet", WalletRouter);

  app.post("/api/stop", (req, res) => {
    res.send({ msg: "Stop Server!" });
    process.exit();
  });

  app.listen(HTTP_PORT, () => {
    console.log("Listening Http Port : " + HTTP_PORT);
  });
}

initHttpServer();
initP2PServer(P2P_PORT);