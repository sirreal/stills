const { execCmd, getProgressiveCmd, getFrameRange } = require('./utils');

class FilterRotate {
  constructor({ degrees = 25, useProgress = true } = {}) {
    this.degrees = degrees;
    this.useProgress = useProgress;
  }

  get name() {
    return 'rotate';
  }

  async applyFrames(frames) {
    const file = frames.file;
    const { numFrames } = frames.getInfo();
    const [start, end] = await getFrameRange(file);
    const rotation = getProgressiveCmd(
      start,
      end,
      numFrames,
      (progress) =>
        `-distort SRT ${
          this.useProgress ? this.degrees * progress : this.degrees
        }`
    );
    execCmd(`convert "${file}" ${rotation} "${file}"`);
  }
}

module.exports = FilterRotate;
