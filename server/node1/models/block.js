const Sequelize = require("sequelize");

module.exports = class Block extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        previousHash: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        timestamp: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        merkleRoot: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        difficulty: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        nonce: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        body: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Block",
        tableName: "blocks",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
};
