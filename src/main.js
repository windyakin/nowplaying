const Log4js = require('log4js');

const logger = Log4js.getLogger();
const Slack = require('./module/slack.js');
const NowPlaying = require('./module/now-playing.js');
const TextFormatter = require('./module/text-formatter.js');

global.EmptyStatus = { status_emoji: '', status_text: '' };

require('dotenv').config({ path: './.environment' });

(async (token) => {
  await (async function loop(oldStatus) {
    let status = global.EmptyStatus;

    try {
      status = TextFormatter.playing2Status(await NowPlaying.getPlayingInfo());
    } catch (err) {
      logger.error(err);
    }

    if (JSON.stringify(status) === JSON.stringify(oldStatus)) {
      if (status === global.EmptyStatus) {
        logger.debug('Not playing song now');
      } else {
        logger.debug('Playing song was not changed');
      }
    } else {
      const response = JSON.parse(await Slack.updateStatusAsync(status, token));
      logger.info(`Status set: ${response.profile.status_text || '(clear)'}`);
    }

    await setTimeout(() => loop(status), 10000);
  }(global.EmptyStatus));
})(process.env.SLACK_TOKEN);
