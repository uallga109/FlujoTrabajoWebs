const { app, BrowserWindow } = require('electron');
const path = require('path'); // <- Necesario para buscar archivos locales

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true }
  });

  // app.isPackaged es "true" si ya es un .exe, y "false" si estás programando
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'index.html')); // Carga la app "cocinada"
  } else {
    win.loadURL('http://localhost:5173'); // Carga el servidor en vivo
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});