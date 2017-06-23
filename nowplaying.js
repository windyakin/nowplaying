// This file is AppleScript(JXA) :)

const System = Application("System Events");
var apps = System.processes.name();

var music = {
	'title': null,
	'artist': null,
	'album': null,
};

for (var i = 0; i < apps.length; i++) {
	if (apps[i] === 'iTunes') {
		const iTunes = Application('iTunes');
		if (iTunes.playerState() === 'playing') {
			music['title']  = iTunes.currentTrack.name();
			music['artist'] = iTunes.currentTrack.artist();
			music['album']  = iTunes.currentTrack.album();
			break;
		}
	}
	else if (apps[i] === 'VOX') {
		const Vox = Application('VOX');
		if (Vox.playerState() !== 0) {
			music['title']  = Vox.track();
			music['artist'] = Vox.artist();
			music['album']  = Vox.album();
			break;
		}
	}
	else if (apps[i] === 'Radiant Player') {
		const RadiantPlayer = Application('Radiant Player');
		if (RadiantPlayer.playerState() === 2) {
			music['title']  = RadiantPlayer.currentSongName();
			music['artist'] = RadiantPlayer.currentSongArtist();
			music['album']  = RadiantPlayer.currentSongAlbum();
			break;
		}
	}
}

JSON.stringify(music);
