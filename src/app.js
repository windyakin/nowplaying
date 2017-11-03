const Bluebird = require('bluebird');
const { ipcMain } = require('electron');
const menubar = require('menubar');
const Storage = Bluebird.promisifyAll(require('electron-json-storage'));

const StatusUpdater = require('./module/status-updater.js');

let su;

const mb = menubar({
  preloadWindow: true,
  height: 200,
  index: `file://${__dirname}/view/index.html`,
});

const startStatusUpdate = async () => {
  let token;
  try {
    token = await Storage.getAsync('config');
  } catch (e) {
    console.error(e);
  }
  console.log(token);
  if (token !== null) {
    su = new StatusUpdater(token);
    su.execute();
  }
};

const setTokenToStrage = async (token) => {
  if (su !== undefined && !su.token !== null) {
    su.token = null;
  }
  await Storage.setAsync('config', token);
  if (token !== null) {
    await startStatusUpdate();
  }
};

mb.on('ready', async () => {
  startStatusUpdate();
});

ipcMain.on('sendToken', async (ev, token) => {
  try {
    await setTokenToStrage(token);
  } catch (e) {
    ev.sender.send('sendTokenResponse', e);
  }
  ev.sender.send('sendTokenResponse', 'OK');
});

ipcMain.on('clearToken', () => {
  setTokenToStrage(null);
});

ipcMain.on('quit', async () => {
  if (su !== undefined && !su.token !== null) {
    await su.clearStatus();
  }
  mb.app.quit();
});
