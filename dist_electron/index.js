

const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const Tray = electron.Tray

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win




function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/public/index.html`)

  // Open the DevTools.
  //win.webContents.openDevTools()

  create_tray()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

function create_tray(){
  const iconName = process.platform === 'win32' ? __dirname+ '/public/assets/images/favicon.png' : __dirname+ '/public/assets/images/favicon.png'

  appIcon = new Tray(iconName)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Remove from tray',
      click: function () {
        //electron.ipcRenderer.send('tray-removed')
        appIcon.destroy()
      }
    }
  ])
  appIcon.setToolTip('dhxMVP Boilerplate.')
  appIcon.setContextMenu(contextMenu)
}

let appIcon = null

//ipc.on('put-in-tray', function (event) {
  //create_tray()
//})

ipc.on('remove-tray', function () {
  appIcon.destroy()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized())win.restore()
    win.focus()
  }
})

if (shouldQuit) {
  app.quit()
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  if (appIcon) appIcon.destroy()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})