import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: join(__dirname, '../../build/icon.png') } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// IPC Handlers
import { readConfig, saveConfig } from './lib/config';
import { awsHandler } from './lib/aws';

ipcMain.handle('config:read', async () => readConfig());
ipcMain.handle('config:save', async (_, config) => saveConfig(config));

ipcMain.handle('aws:list-jobs', async (_, config) => awsHandler.getJobs(config));
ipcMain.handle('aws:get-job-runs', async (_, config, jobName) => awsHandler.getJobRuns(config, jobName));

ipcMain.handle('aws:list-crawlers', async (_, config) => awsHandler.getCrawlers(config));
ipcMain.handle('aws:get-crawler-runs', async (_, config, crawlerName) => awsHandler.getCrawlerRuns(config, crawlerName));

ipcMain.handle('aws:list-databases', async (_, config) => awsHandler.getDatabases(config));
ipcMain.handle('aws:get-tables', async (_, config, dbName) => awsHandler.getTables(config, dbName));

ipcMain.handle('aws:list-workflows', async (_, config) => awsHandler.getWorkflows(config));
ipcMain.handle('aws:get-workflow-runs', async (_, config, wfName) => awsHandler.getWorkflowRuns(config, wfName));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
