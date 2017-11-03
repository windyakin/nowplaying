const Bluebird = require('bluebird');
const AppleScript = Bluebird.promisifyAll(require('applescript'));

module.exports = class PlayingInfoGetter {
  static async execute() {
    try {
      const value = await AppleScript.execFileAsync(`${__dirname}/../jxa/nowplaying.js`);
      return value;
    } catch (e) {
      throw e;
    }
  }
};
