// Module Imports
const electron = require('electron')
const url = require('url')
const path = require('path')
const {BrowserWindow} = electron;

let window;
let currentTheme;

// Handle Create Micro Debug window
function createMicroDebugWindow(){
	// prevent duplicate windows
	if(window) {
		window.show()
		return
	}

	// create new window
	window = new BrowserWindow({
		autoHideMenuBar: true,
		width: 400,
		height: 600,
		title: 'Micro Data',
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true
		},
		show: false,
	})

	// load html into window
	window.loadURL(url.format({
		pathname: path.join(__dirname, 'microDebugWindow.html'),
		protocol: 'file:',
		slashes: true
	}))

	// When the window is rendered, update the theme and show
	window.once('ready-to-show', () => {
		window.webContents.send('theme:change', currentTheme)
		window.show()
	})

	// Garbage collection handle
	window.on('close', function(){
		window=null
	})

	console.log('microDebugWindow: ',window)
}

module.exports = {
	Create: createMicroDebugWindow,

	Update: function(data){
		if(window){
				window.webContents.send('micro:debug', data)
		}
	},

	Theme: function(theme){
		currentTheme = theme
		if(window){
			window.webContents.send('theme:change', theme)
		}
	}
}