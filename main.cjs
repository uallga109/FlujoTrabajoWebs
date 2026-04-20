const { app, BrowserWindow } = require('electron');
const path = require('path'); // <- Necesario para buscar archivos locales
const { autoUpdater } = require('electron-updater'); // <- El radar modo Pro

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

app.whenReady().then(() => {
  createWindow();

  // Si el programa está instalado (.exe), busca actualizaciones en GitHub en silencio
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// Chivatos de consola (por si quieres comprobar si funciona internamente)
autoUpdater.on('checking-for-update', () => console.log('Buscando actualizaciones...'));
autoUpdater.on('update-available', () => console.log('¡Hay una nueva versión! Descargando...'));
autoUpdater.on('update-downloaded', () => console.log('Descarga lista. Se instalará al cerrar la app.'));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});