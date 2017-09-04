const Bluebird = require('bluebird');
const AppleScript = Bluebird.promisifyAll(require('applescript'));

module.exports = class NowPlaying {
  static async getPlayingInfo() {
    try {
      const value = await AppleScript.execFileAsync(`${__dirname}/../jxa/nowplaying.js`);
      return value;
    } catch (e) {
      throw e;
    }
  }
};
