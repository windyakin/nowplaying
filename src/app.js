const Bluebird = require('bluebird');
const { ipcMain } = require('electron');
const menubar = require('menubar');
const Storage = Bluebird.promisifyAll(require('electron-json-storage'));

const StatusUpdater = require('./module/status-updater.js');
const Slack = require('./module/slack.js');

let statusUpdater;

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
    statusUpdater = new StatusUpdater(token);
  }
};

const setTokenToStrage = async (token) => {
  if (statusUpdater !== undefined && statusUpdater.token !== null) {
    statusUpdater.token = null;
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
    const response = await Slack.testAuthorizeAsync('token');
    if (!response.ok) {
      ev.sender.send('sendTokenResponse', 'Token Invalid');
      throw Error();
    }
  } catch (e) {
    return;
  }
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
  if (statusUpdater !== undefined && !statusUpdater.token !== null) {
    await statusUpdater.clearStatus();
  }
  mb.app.quit();
});
