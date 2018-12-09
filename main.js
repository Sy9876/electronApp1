'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        useContentSize: true,
        width: 800,
        height: 600,
        resizable: false,
        fullscreen: false,
        webPreferences: {
            nodeIntegration: false,
        }
    });
    mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
    mainWindow.on('closed', () => { mainWindow = null; });
});
