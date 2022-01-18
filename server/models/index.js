const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};
const User = require("./user");
const Block = require("./block");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Block = Block;
db.Sequelize = Sequelize;

User.init(sequelize);
Block.init(sequelize);

module.exports = db;
