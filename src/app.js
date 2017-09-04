const { ipcMain } = require('electron');
const menubar = require('menubar');
const Storage = require('electron-json-storage');

const mb = menubar({
  preloadWindow: true,
  height: 200,
  index: `file://${__dirname}/view/index.html`,
});

mb.on('ready', () => {
  Storage.get('config', (error, data) => {
    if (error) throw error;
    if (Object.keys(data).length === 0) {
      // データがないときの処理
    } else {
      // データがあるときの処理
    }
  });
});

ipcMain.on('requsetMessage', (ev, message) => {
  Storage.set('config', message, (error) => {
    if (error) throw error;
  });
  ev.sender.send('responseMessage', 'pong');
});
