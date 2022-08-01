/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import sqlite from 'sqlite3';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { Promise } from 'bluebird';
import AppDAO from './dao';
import BillRepository from './bill_repository';
import ItemRepository from './item_repository';
import console from 'console';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// const sqlite3 = sqlite.verbose();
// const db = new sqlite3.Database('sqlite3_database.db');
const dao = new AppDAO('sqlite3_database.db');
let currentBillId;
const billOne = {
  name: `Customer One ${Math.floor(Math.random() * 10) + 1}`,
};
const billRepo = new BillRepository(dao);
const itemRepo = new ItemRepository(dao);
billRepo.createTable();

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

ipcMain.on('create:bill', async (event, mainData) => {
  console.log('Inside Main create:bill');
  console.log({ mainData });
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(mainData.name);
  billRepo.create(mainData.name).then((result) => {
    console.log('result from create:bill sql');
    console.log({ result });
    win.webContents.send('create:bill', result);
  });
});

ipcMain.on('update:bill', async (event, mainData) => {
  console.log('Inside Main update:bill');
  console.log({ mainData });
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  // event.reply('update:bill', mainData);
  billRepo.update(mainData).then((result) => {
    console.log('result from update:bill sql');
    console.log({ result });
    win.webContents.send('update:bill', result);
  });
});

ipcMain.on('delete:bill', async (event, mainData) => {
  console.log('Inside Main delete:bill');
  console.log({ mainData });
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  billRepo.delete(mainData).then((result) => {
    console.log('result from delete:bill sql');
    console.log({ result });
    win.webContents.send('delete:bill', result);
  });
});

ipcMain.on('get:bills', async (event, mainData) => {
  console.log('Inside Main get:bills');
  console.log({ mainData });
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  let resultSet;
  billRepo.getAll().then((promiseData) => {
    // console.log({ promiseData });
    resultSet = promiseData;
    // event.reply('get:bills', resultSet);
    win.webContents.send('get:bills', resultSet);
  });
  // console.log({ resultSet });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
