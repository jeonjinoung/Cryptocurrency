const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcrypt");

// =============================================
//                /api/user
// =============================================

router.post("/addUser", async (req, res) => {
  const { email, pw, name } = req.body;
  try {
    const exUser = await User.findOne({
      where: {
        email,
      },
    });
    if (exUser) {
      return res.json({ success: false });
    }
    const hash = await bcrypt.hash(pw, 12);
    await User.create({
      name,
      pw: hash,
      email,
    });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.json({ success: false, error });
  }
});

router.post("/Login", async (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(401).json({ loginSuccess: false });
    }
    if (info) {
      return res.status(401).json({ loginSuccess: false, message: info });
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        return res.status(400).json({ loginSuccess: false });
      }
      const UserInfo = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["pw"],
        },
      });
      return res.status(200).json({ UserInfo, loginSuccess: true });
    });
  })(req, res);
});

module.exports = router;