const Bluebird = require('bluebird');
const Log4js = require('log4js');
const AppleScript = Bluebird.promisifyAll(require('applescript'));

const logger = Log4js.getLogger();
const Slack = require('./module/slack.js');
const TextFormatter = require('./module/text-formatter.js');

global.EmptyStatus = { status_emoji: '', status_text: '' };

require('dotenv').config({ path: './.environment' });

(() => {
  (function loop(oldStatus) {
    let nextStatus = oldStatus;

    AppleScript.execFileAsync(`${__dirname}/jxa/nowplaying.js`)

      .then(str => TextFormatter.playing2Status(str))
      .catch((err) => {
        logger.error(err);
        return global.EmptyStatus;
      })

      .then((status) => {
        // 前のステータスと同じのときはリクエストを送らないようにする
        if (JSON.stringify(status) === JSON.stringify(oldStatus)) {
          if (status === global.EmptyStatus) {
            return Promise.reject('Not playing song now');
          }
          return Promise.reject('Playing song was not changed');
        }
        nextStatus = status;
        return status;
      })

      .then(status => Slack.updateStatusAsync(status))

      .then((data) => {
        const json = JSON.parse(data);
        logger.info(`Status set: ${json.profile.status_text || '(clear)'}`);
      })
      .catch((e) => {
        logger.debug(e);
      })

      .then(() => {
        setTimeout(() => loop(nextStatus), 10000);
      });
  }(global.EmptyStatus));
})();
