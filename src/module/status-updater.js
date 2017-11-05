const Log4js = require('log4js');

const logger = Log4js.getLogger();
const Slack = require('./slack.js');
const PlayingInfoGetter = require('./playing-info-getter.js');
const TextFormatter = require('./text-formatter.js');

module.exports = class StatusUpdater {
  constructor(token) {
    this.token = token;
    this.EmptyStatus = { status_emoji: '', status_text: '' };
    this.execute(this.EmptyStatus);
  }

  get token() {
    return this.Token;
  }

  set token(token) {
    if (token == null) {
      this.clearStatus();
    }
    this.Token = token;
  }

  async setTokenWithValid(token) {
    if (token !== null) {
      const response = await Slack.testAuthorizeAsync(token);
      if (!response.ok) throw Error('Invalid token');
    }
    this.token = token;
  }

  async execute(oldStatus) {
    let status = {};
    if (this.token === null) return;

    try {
      status = await this.getPlayingStatus();
    } catch (err) {
      logger.error(err);
    }

    if (JSON.stringify(status) === JSON.stringify(oldStatus || {})) {
      if (status === this.EmptyStatus || status === undefined) {
        logger.debug('Not playing song now');
      } else {
        logger.debug('Playing song was not changed');
      }
    } else {
      await this.updateStatus(status);
    }
    if (this.token !== null) {
      setTimeout(() => { this.execute(status); }, 10000);
    }
  }

  async updateStatus(status) {
    let response = {};
    try {
      response = JSON.parse(await Slack.updateStatusAsync(status, this.token));
    } catch (err) {
      logger.error(err);
    }
    try {
      if (response.ok) {
        logger.info(`Status set: ${response.profile.status_text || '(clear)'}`);
      } else {
        throw Error(response);
      }
    } catch (err) {
      logger.error(err);
    }
  }

  async clearStatus() {
    await this.updateStatus(this.EmptyStatus);
  }

  async getPlayingStatus() {
    const playingInfo = await PlayingInfoGetter.execute();
    return TextFormatter.playing2Status(playingInfo) || this.EmptyStatus;
  }
};
