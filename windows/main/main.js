// Module Imports
const electron = require('electron')
const url = require('url')
const path = require('path')
const {app, BrowserWindow} = electron;

let mainWindow;
let currentTheme;


function createMainWindow(){
    // Create new window
    mainWindow = new BrowserWindow(
			{
				show: false,
				webPreferences: {
					nodeIntegration: true
				}
			})

    mainWindow.maximize()

    // Load html into window
    mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'mainWindow.html'),
			protocol: 'file:',
			slashes: true
    }))

    // Show page after it's rendered
    mainWindow.once('ready-to-show', () => {
			mainWindow.show()
    })

    // Quit app when closed
    mainWindow.on('closed', function(){
			app.quit();
    })
}


module.exports = {
	Create: createMainWindow,

	Theme: function(theme){
		currentTheme = theme
		if(mainWindow){
			mainWindow.webContents.send('theme:change', theme)
		}
	},
	
	LoadSettings: function(state){
		mainWindow.webContents.send('settings:build', state)
	},

	LoadState: function(state){
		mainWindow.webContents.send('state:build', state)
	},

	Update: function(command, value){
		mainWindow.webContents.send('serial:wrote', command, value)
	}
}