// Module Imports
const electron = require('electron')
const url = require('url')
const path = require('path')
const {BrowserWindow} = electron;

// Local Imports
const Serial = require('../../serial.js')

let window;
let currentTheme;

// Handle create connect device window
function createConnectDeviceWindow(){
	// Create new window
	window = new BrowserWindow({
		alwaysOnTop: true,
		autoHideMenuBar: true,
		height: 170,
		width: 200,
		title: 'Connect To',
		webPreferences: {
			nodeIntegration: true
		},
		show: false,
	})

	// Load html into window
	window.loadURL(url.format({
		pathname: path.join(__dirname, 'connectDeviceWindow.html'),
		protocol: 'file:',
		slashes: true
    }))
    
	// When the window is rendered, update the theme and show
	window.once('ready-to-show', () => {
		window.webContents.send('theme:change', currentTheme)
		Serial.GetDevices().then((devices) =>{
			console.log('sending devices: ',devices)
			window.webContents.send('serial:devices', devices)
			window.show()
		})
		
	})

	// Garbage collection handle
	window.on('close', function(){
		window=null
	})
}

module.exports = {
	Create: createConnectDeviceWindow,
	
	Theme: function(theme) {
		currentTheme = theme
		if(window){
			window.webContents.send('theme:change', theme)
		}
	},
}