const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
};

const MemPoolMessageType = {
  REQUEST_MEMPOOL : 3,
  MEMPOOL_RESPONSE : 4,
}

module.exports = { MessageType, MemPoolMessageType };