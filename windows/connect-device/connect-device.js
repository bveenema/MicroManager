// Module Imports
const electron = require('electron')
const url = require('url')
const path = require('path')
const {BrowserWindow} = electron;
const {isEqual} = require('lodash')

// Local Imports
const Serial = require('../../serial.js')

let window;
let currentTheme;

// Handle create connect device window
function createConnectDeviceWindow(){
	// prevent duplicate windows
	if(window) {
		window.show()
		return
	}

	// Create new window
	window = new BrowserWindow({
		autoHideMenuBar: true,
		height: 102+38,
		width: 284+16,
		title: 'Connect To',
		titleBarStyle: 'hidden',
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
			window.webContents.send('serial:devices', devices, Serial.Path())
			this.devices = devices;
			window.show()
		})	
	})

	// Check for new serial devices
	if(this.GetSerial === undefined){
		this.GetSerial = setInterval(function(win){
			Serial.GetDevices().then((devices) => {
				if(isEqual(this.devices, devices) === false){
					win.webContents.send('serial:devices', devices)
					this.devices = devices
				}
			})
		}.bind(this), 1000, window)
	}

	// Garbage collection handle
	window.on('close', function(){
		window=null
		clearInterval(this.GetSerial)
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