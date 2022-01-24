const Sequelize = require("sequelize");

module.exports = class Address extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        address: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Address",
        tableName: "AddressWallet",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
};
