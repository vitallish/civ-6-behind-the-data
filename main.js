const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var chokidar = require('chokidar');

var watcher 
// One-liner for current directory, ignores .dotfiles

const Config = require('electron-config');
const config = new Config()
const {ipcMain} = require('electron')



function watchPlayerStats(civ_6_path){
	var player_stats_path  = path.join(civ_6_path, "Logs","Player_Stats.csv")
	watcher = chokidar.watch('file, dir, glob, or array', {
		ignored: /(^|[\/\\])\../,
		persistent: true,
		awaitWriteFinish: true // waits 2 seconds before emitting event
	});
	watcher.add(player_stats_path)
	watcher.on('change',(path, stats) => {
		// This is where database write stuff will go
		var file_log = {event: "changed",
						path: path,
						time: Date()}
		win.webContents.send("file-change", file_log);
	})
}
	

// get run on new folder begin chosen
ipcMain.on('async-file-path', (event, arg) => {
	
	watchPlayerStats(arg)
	config.set("folder-path", arg);
	// send the newly set folder path back to renderer
	win.webContents.send("folder-path", config.get("folder-path"));
	
})
  
ipcMain.on('settings-loaded', (event, arg) =>{
		
	watchPlayerStats(config.get("folder-path"))
	win.webContents.send("folder-path", config.get("folder-path"));
})

