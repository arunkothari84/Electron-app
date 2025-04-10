import {
  app,
  BrowserWindow,
  screen,
  globalShortcut,
  Tray,
  Menu,
} from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import os from "os";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const createWindow = () => {
  const currentScreen = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  );
  // Get the current screen bounds and scale factor
  // to calculate the window size.
  // This is useful for high-DPI displays.
  // The scale factor is used to adjust the window size
  const bounds = currentScreen.bounds;
  const WINDOW_WIDTH = bounds.width / currentScreen.scaleFactor;
  const WINDOW_HEIGHT = bounds.height / currentScreen.scaleFactor;
  let x = bounds.x + bounds.width / 4;
  let y = bounds.y + bounds.height / 4;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    show: false,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: Math.trunc(x),
    y: Math.trunc(y),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  mainWindow.setBackgroundColor("#111827");
  mainWindow.maximize();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  mainWindow.on("blur", () => {
    if (mainWindow && !mainWindow.isFocused()) {
      mainWindow.hide(); // Hide the window instead of closing it
    }
  });
  // mainWindow.webContents.openDevTools();

  if (!tray) {
    tray = new Tray(path.join(os.homedir(), ".shortcut-helper", "icon.png")); // replace with your tray icon path
    const contextMenu = Menu.buildFromTemplate([
      { label: "Open", click: () => mainWindow.show() },
      { label: "Quit", click: () => app.quit() },
    ]);
    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
      if (mainWindow) {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      }
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  globalShortcut.register("Control+Shift+H", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide(); // Hide if visible
      } else {
        mainWindow.show(); // Show if hidden
        mainWindow.focus(); // Bring it to front
      }
    } else {
      createWindow(); // Create if doesn't exist
    }
  });

  globalShortcut.register("Escape", () => {
    if (mainWindow && mainWindow.isFocused()) {
      mainWindow.hide(); // Hide the window when ESC is pressed
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
