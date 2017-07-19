const { ipcMain } = require('electron');
const menubar = require('menubar');

const mb = menubar({
  preloadWindow: true,
  index: `file://${__dirname}/html/index.html`,
});

mb.on('ready', () => {
  console.log('test');
});

ipcMain.on('requsetMessage', (ev, message) => {
  console.log(message);
  ev.sender.send('responseMessage', 'pong');
});
