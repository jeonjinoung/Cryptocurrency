//모듈가져오기
const passport = require("passport");
const local = require("./localStrategy");

//User모델 폼가져오기
const User = require("../models/user");

//User 아이디를 가져왓 ㅓ검사해주는것
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //serializeUser로 인한 user id값이 널일데 로그인이 안되도록 조건

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};
