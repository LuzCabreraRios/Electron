const {
  app,
  BrowserWindow,
  desktopCapturer,
  dialog,
  ipcMain,
  Menu
} = require('electron');

const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// --- IPC HANDLERS ---

ipcMain.handle('get-sources', async () => {
  return await desktopCapturer.getSources({
    types: ['window', 'screen']
  });
});

ipcMain.handle('show-source-menu', async (event, sources) => {
  return new Promise(resolve => {
    let resolved = false;

    const menu = Menu.buildFromTemplate(
      sources.map(source => ({
        label: source.name,
        click: () => {
          resolved = true;
          resolve(source); // ✅ Success! Return the source.
        }
      }))
    );

    menu.popup();

    menu.once('menu-will-close', () => {
      // ⏳ WAIT 100ms before cancelling. 
      // This gives the 'click' event time to run first.
      setTimeout(() => {
        if (!resolved) {
          resolve(null); // ❌ Only return null if no click happened
        }
      }, 100);
    });
  });
});

// ADDED: You are calling this in preload.js, so you need it here!
ipcMain.handle('save-video', async (event, arrayBuffer) => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    return true; // Success
  }
  return false; // Canceled
});