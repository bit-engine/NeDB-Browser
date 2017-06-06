const electron = require('electron'),
	path = require('path'),
	url = require('url'),
	fs = require('fs'),
	app = electron.app,
	BrowserWindow = electron.BrowserWindow,
	ipcMain = electron.ipcMain;


let sourceWindow = null,
	browserWindow = null;

function createSourceWindow(){
	sourceWindow = new BrowserWindow({
		width: 400,
		height: 520,
		frame: true,
		resizable: false
	});
	sourceWindow.loadURL(url.format({
		pathname: path.join(__dirname,'app','index.html'),
		protocol: 'file',
		slashes: true
	}));
	sourceWindow.webContents.openDevTools();
}

function createBrowserWindow(sources){
	browserWindow = new BrowserWindow({
		width: 1200,
		height: 750,
		minWidth: 1200,
		minHeight: 750
	});
	browserWindow.loadURL(url.format({
		pathname: path.join(__dirname,'app','browser.html'),
		protocol: 'file',
		slashes: true
	}));
	browserWindow.webContents.openDevTools();
	browserWindow.initialSources = sources;
}

app.on('ready',createSourceWindow);

app.on('window-all-closed', function(){
	app.quit();
});

ipcMain.on('source-selected',function(ev, sources){
	createBrowserWindow(sources);
	if(sourceWindow){
		sourceWindow.close();
	}
});