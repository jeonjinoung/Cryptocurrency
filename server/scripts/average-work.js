const { Blocks, nextBlock } = require('../blockchain/blocks');
const { addBlock } = require('../utils/isValidBlock');

// console.log('first block : ', Blocks[Blocks.length-1]);

function work() {
  let newBlock, prevTimestamp, nextTimestamp, miningBlock, timeDiff, average;
  const times = [];

  for (let i = 0; i < 100; i++) { 
    prevTimestamp = Blocks[Blocks.length-1].header.timestamp;

    newBlock = nextBlock([ 'initial' ]);
    addBlock(newBlock);

    miningBlock = Blocks[Blocks.length-1];

    nextTimestamp = newBlock.header.timestamp;

    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num) => (total + num))/times.length;

    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${miningBlock.header.difficulty}. Average time: ${average}ms`);
  }
}

module.exports = {
  work
}