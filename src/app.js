const { app, BrowserWindow, Menu, ipcMain } = require('electron');

let window;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  window = new BrowserWindow({ width: 800, height: 600 });
  window.loadURL(`file://${__dirname}/html/index.html`);

  window.on('closed', () => {
    window = null;
  });
});

ipcMain.on('requsetMessage', (ev, message) => {
  console.log(message);
  ev.sender.send('responseMessage', 'pong');
});
