import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { electronApp, is } from '@electron-toolkit/utils'

import { join } from 'path'


const transitionWindowToWindowedMode = (window: BrowserWindow): void => {
  window.setFullScreen(false);
  window.unmaximize();
  window.setSize(1600, 900);
  window.center();
};

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
    },
    frame: true,
    fullscreen: true,
  });
  mainWindow.setAspectRatio(16 / 9);

  mainWindow.on(
    'ready-to-show',
    () => { mainWindow.show(); }
  );

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  mainWindow.webContents.openDevTools();

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

const setupElectronApiHandlers = (): void => {
  ipcMain.handle('fullscreen', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.setFullScreen(true);
    }
  });

  ipcMain.handle('windowed', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      transitionWindowToWindowedMode(window);
    }
  });

  ipcMain.handle('devtools', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.webContents.openDevTools();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  setupElectronApiHandlers();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on(
  'window-all-closed',
  () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
);
