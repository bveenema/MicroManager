// Module Imports
const electron = require('electron')
const url = require('url')
const path = require('path')
const {app, BrowserWindow, Menu, ipcMain} = electron;
const contextMenu = require('electron-context-menu')

// Local Imports


// SET ENC
// process.env.NODE_ENV = 'production'

// Right Click (Context Menu)
contextMenu({
	prepend: (defaultActions, params, browserWindow) => [{
			label: 'Action',
	}],
	showInspectElement: true
});

let mainWindow;
let connectDeviceWindow;

// Listen for app to be ready
app.on('ready', function(){
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

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);
})

// Handle create add window
function createConnectDeviceWindow(){
	// Create new window
	connectDeviceWindow = new BrowserWindow({
		parent: mainWindow,
		width: 300,
		height: 200,
		title: 'Connect To',
		webPreferences: {
			nodeIntegration: true
		}
	})
	// Load html into window
	connectDeviceWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'connectDeviceWindow.html'),
		protocol: 'file:',
		slashes: true
	}))

	// Garbage collection handle
	connectDeviceWindow.on('close', function(){
		connectDeviceWindow=null
	})
}

// Catch item:add
ipcMain.on('item:add', function(e, item){
	console.log(item)
	mainWindow.webContents.send('item:add', item)
	connectDeviceWindow.close()
})

// Create Menu Template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Connect',
				accelerator: (process.platform == 'darwin') ? 'Command+K' : 'Ctrl+K',
				click(){
					createConnectDeviceWindow()
				}
			},
			{
				label: 'Quit',
				accelerator: (process.platform == 'darwin') ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Theme',
				submenu: [
					{
						label: 'Default',
						click(){
							mainWindow.webContents.send('theme:change', 'default')
						}
					},
					{
						label: 'Light',
						click(){
							mainWindow.webContents.send('theme:change', 'light')
						}
					},
					{
						label: 'Dark',
						click(){
							mainWindow.webContents.send('theme:change', 'dark')
						}
					}
					
				]
			}
		]
	}
];

// if mac, add empty object to menu
if(process.platform == 'darwin'){
	mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: (process.platform == 'darwin') ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	})
}