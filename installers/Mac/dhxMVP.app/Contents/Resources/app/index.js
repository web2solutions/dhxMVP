var electron_app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Menu = require('menu');
var Tray = require('tray');
var trayimage = __dirname + '/public/assets/images/x.png';


//electron_app.addRecentDocument('/Users/USERNAME/Desktop/work.type');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

var appIcon = null;

// Quit when all windows are closed.
electron_app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform != 'darwin') {
    electron_app.quit();
  //}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
electron_app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, icon: trayimage/*, transparent: true, frame: false*/});

  //mainWindow.setRepresentedFilename('/etc/passwd');
  //mainWindow.setDocumentEdited(true);

  // and load the index.html of the electron_app.
  mainWindow.loadUrl('file://' + __dirname + '/public/index.html');

  //mainWindow.loadUrl('http://www.dhtmlx.com.br/dbDemo/desktop.html');

  // Open the DevTools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    alert();
    // Dereference the window object, usually you would store windows
    // in an array if your electron_app supports multi windows, this is the time
    // when you should delete the corresponding element.
    //mainWindow = null;
  });

  
  appIcon = new Tray( trayimage );
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Contacts', type: 'radio' },
    { label: 'Events', type: 'radio' },
    { label: 'Chats', type: 'radio', checked: true },
    { label: 'Close application', type: 'radio' }
  ]);
  appIcon.setToolTip('dhxMVP');
  appIcon.setContextMenu(contextMenu);
});