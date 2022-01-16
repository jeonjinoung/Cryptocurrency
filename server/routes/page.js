const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/free", isLoggedIn, (req, res) => {
  res.status(200).json("free");
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.status(200).json("join");
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.status(200).json("main");
});

module.exports = router;
