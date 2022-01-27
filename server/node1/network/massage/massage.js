const {
  getLastBlock,
  getBlocks,
} = require("../../blockchain/blocks");
const { MessageType } = require("./type");

function responseLatestMsg() {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify([getLastBlock()]),
  };
}

function responseAllChainMsg() {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify(getBlocks()),
  };
}

function queryAllMsg() {
  return {
    type: MessageType.QUERY_ALL,
    data: null,
  };
}

function queryLatestMsg() {
  return {
    type: MessageType.QUERY_LATEST,
    data: null,
  };
}

module.exports = {
  responseLatestMsg,
  responseAllChainMsg,
  queryAllMsg,
  queryLatestMsg
}