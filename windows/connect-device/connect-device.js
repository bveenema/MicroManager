// Module Imports
const electron = require('electron')
const url = require('url')
const path = require('path')
const {BrowserWindow} = electron;

let connectDeviceWindow;
let currentTheme;

// Handle create connect device window
function createConnectDeviceWindow(){
	// Create new window
	connectDeviceWindow = new BrowserWindow({
		alwaysOnTop: true,
		autoHideMenuBar: true,
		height: 200,
		width: 300,
		title: 'Connect To',
		webPreferences: {
			nodeIntegration: true
		},
		show: false,
	})

	// Load html into window
	connectDeviceWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'connectDeviceWindow.html'),
		protocol: 'file:',
		slashes: true
    }))
    
    // When the window is rendered, update the theme and show
    connectDeviceWindow.once('ready-to-show', () => {
		connectDeviceWindow.webContents.send('theme:change', currentTheme)
		connectDeviceWindow.show()
	})

	// Garbage collection handle
	connectDeviceWindow.on('close', function(){
		connectDeviceWindow=null
	})
}

module.exports = {
    Create: createConnectDeviceWindow,
    Theme: function(theme) {
		currentTheme = theme
		if(connectDeviceWindow){
			connectDeviceWindow.webContents.send('theme:change', theme)
		}
	},
}