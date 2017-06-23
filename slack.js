const request = require('request-promise');

module.exports = class Slack {
	static updateStatusAsync(status) {
		return request.post({
			'url': 'https://slack.com/api/users.profile.set',
			'form': {
				'token': process.env.SLACK_TOKEN,
				'profile': JSON.stringify(status)
			}
		});
	}
};
