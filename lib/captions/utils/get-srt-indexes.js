const { random, findIndex } = require('lodash');

isStartValid = (text) => {
  return !/^[a-z]/.test(text);
};

isEndValid = (text) => {
  return !/,$/.test(text);
};

const getIndexFromSeconds = (srt, s) => {
  return findIndex(srt, ({ start }) => start >= s);
};

module.exports = getSrtIndexes = (
  srt,
  num = 3,
  max = 10,
  paramStart = null,
  isSeconds = false
) => {
  let start = Number.isFinite(paramStart)
    ? isSeconds
      ? getIndexFromSeconds(srt, paramStart)
      : paramStart
    : random(srt.length - num);
  let end = start + num - 1;
  let startContinue = true;
  let endContinue = true;
  while (startContinue) {
    const { text } = srt[start];
    if (!isStartValid(text) && start >= 0) {
      start -= 1;
      end -= 1;
    } else {
      startContinue = false;
    }
  }
  while (endContinue) {
    const { text } = srt[end];
    if (!isEndValid(text) && end < srt.length) {
      end += 1;
    } else {
      endContinue = false;
    }
  }
  return [start, Math.min(end, start + max)];
};
