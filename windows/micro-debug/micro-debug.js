// Module Imports
const electron = require('electron')
const url = require('url')
const path = require('path')
const {BrowserWindow} = electron;

let microDebugWindow;
let currentTheme;

// Handle Create Micro Debug window
function createMicroDebugWindow(){
	// create new window
	microDebugWindow = new BrowserWindow({
		autoHideMenuBar: true,
		width: 400,
		height: 600,
		title: 'Micro Data',
		webPreferences: {
			nodeIntegration: true
		},
		show: false,
	})

	// load html into window
	microDebugWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'microDebugWindow.html'),
		protocol: 'file:',
		slashes: true
	}))

	// When the window is rendered, update the theme and show
	microDebugWindow.once('ready-to-show', () => {
		microDebugWindow.webContents.send('theme:change', currentTheme)
		microDebugWindow.show()
	})

	// Garbage collection handle
	microDebugWindow.on('close', function(){
		microDebugWindow=null
	})

	console.log('microDebugWindow: ',microDebugWindow)
}

module.exports = {
	Create: createMicroDebugWindow,

	Update: function(data){
		if(microDebugWindow){
				microDebugWindow.webContents.send('micro:debug', data)
		}
	},

	Theme: function(theme){
		currentTheme = theme
		if(microDebugWindow){
			microDebugWindow.webContents.send('theme:change', theme)
		}
	}
}