// This file is AppleScript(JXA) :)

const System = Application("System Events");
var apps = System.processes.name();

var music = {
	'title': null,
	'artist': null,
	'album': null,
	'time': null
};

for (var i = 0; i < apps.length; i++) {
	if (apps[i] === 'iTunes') {
		const iTunes = Application('iTunes');
		if (iTunes.playerState() === 'playing') {
			music['title']  = iTunes.currentTrack.name();
			music['artist'] = iTunes.currentTrack.artist();
			music['album']  = iTunes.currentTrack.album();
			music['time']   = iTunes.currentTrack.time();
			break;
		}
	}
	else if (apps[i] === 'VOX')
	{
		const Vox = Application('VOX');
		if (Vox.playerState() !== 0) {
			music['title']  = Vox.track();
			music['artist'] = Vox.artist();
			music['album']  = Vox.album();
			var time = Vox.totalTime();
			music['time']   = parseInt(time/60, 10) + ':' + ("0" + parseInt(time%60, 10)).slice(-2);
			break;
		}
	}
}

JSON.stringify(music);
