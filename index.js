const Promise     = require('bluebird');
const AppleScript = Promise.promisifyAll(require('applescript'));

AppleScript.execFileAsync('./nowplaying.js')
.then((str) => {
	var player = JSON.parse(str);
	console.log(player);
})
.catch((err) => {
	console.log(err);
});

