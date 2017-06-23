const Promise = require('bluebird');
const Log4js = require('log4js');
const AppleScript = Promise.promisifyAll(require('applescript'));

const logger = Log4js.getLogger();

const Slack = require(`${__dirname}/slack.js`);

const EmptyStatus = { status_emoji: '', status_text: '' };

require('dotenv').config({ path: './.environment' });

(() => {
  (function loop(oldStatus) {
    AppleScript.execFileAsync(`${__dirname}/nowplaying.js`)
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
        oldStatus = status;
        return status;
      })
      .then(status => Slack.updateStatusAsync(status))
      .catch(e => e)
      .then((data) => {
        logger.debug(data);
        setTimeout(() => loop(oldStatus), 15000);
      });
  }(EmptyStatus));
})();
