const Promise = require('bluebird');
const Log4js = require('log4js');
const AppleScript = Promise.promisifyAll(require('applescript'));

const logger = Log4js.getLogger();

const Slack = require('./module/slack.js');

const EmptyStatus = { status_emoji: '', status_text: '' };

require('dotenv').config({ path: './.environment' });

(() => {
  (function loop(oldStatus) {
    let nextStatus = oldStatus;
    AppleScript.execFileAsync(`${__dirname}/jxa/nowplaying.js`)
      .then((str) => {
        const playing = JSON.parse(str);
        if (!(playing.title && playing.artist)) {
          return EmptyStatus;
        }
        let status = `${playing.title} / ${playing.artist}`;
        if (status.length > 100) {
          status = `${status.slice(0, 97)}...`;
        }
        return { status_emoji: ':headphones:', status_text: status };
      })
      .catch((err) => {
        logger.error(err);
      })
      .then((status) => {
        // 前のステータスと同じのときはリクエストを送らないようにする
        if (JSON.stringify(status) === JSON.stringify(oldStatus)) {
          return Promise.reject('Playing song was not changed');
        }
        nextStatus = status;
        return status;
      })
      .then(status => Slack.updateStatusAsync(status))
      .catch(e => e)
      .then((data) => {
        logger.debug(data);
        setTimeout(() => loop(nextStatus), 15000);
      });
  }(EmptyStatus));
})();
