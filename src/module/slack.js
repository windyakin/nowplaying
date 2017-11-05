const request = require('request-promise');

module.exports = class Slack {
  static updateStatusAsync(status, token) {
    return request.post({
      url: 'https://slack.com/api/users.profile.set',
      form: {
        token,
        profile: JSON.stringify(status),
      },
    });
  }

  static testAuthorizeAsync(token) {
    return request.post({
      url: 'https://slack.com/api/auth.test',
      form: {
        token,
      },
    });
  }
};
