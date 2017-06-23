require('dotenv').config({'path': './.environment'});

const Promise     = require('bluebird');
const AppleScript = Promise.promisifyAll(require('applescript'));
const moment      = require('moment');
const Slack       = require(__dirname + '/slack.js');

const EmptyStatus = {'status_emoji': '', 'status_text': ''};

(() => {
	(function loop(oldStatus) {
		AppleScript.execFileAsync(__dirname + '/nowplaying.js')
			.then((str) => {
				let playing = JSON.parse(str);
				if ( !(playing.title && playing.artist) ) {
					return EmptyStatus;
				}
				let status = [playing.title, playing.artist].join(' / ');
				if ( status.length > 100 ) {
					status = status.slice(0, 97) + '...';
				}
				return {'status_emoji': ':headphones:', 'status_text': status};
			})
			.catch((err) => {
				console.error(err);
			})
			.then((status) => {
				// 前のステータスと同じのときはリクエストを送らないようにする
				if ( JSON.stringify(status) === JSON.stringify(oldStatus) ) {
					return Promise.reject('Playing song was not changed');
				}
				oldStatus = status;
				return status;
			})
			.then((status) => Slack.updateStatusAsync(status))
			.catch((e) => e)
			.then((data) => {
				console.log(moment().format('YYYY-MM-DD HH:mm:ss: ') + data);
				setTimeout(() => loop(oldStatus), 15000);
			});
	})(EmptyStatus);
})();
