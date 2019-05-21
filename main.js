// Module Imports
const electron = require('electron')
const fs = require('fs')
const {app, Menu} = electron;
const contextMenu = require('electron-context-menu')

// Local Imports
const {UpdateMockSerial} = require('./serial')

// Windows
const MainWindow = require('./windows/main/main.js')
const MicroDebugWindow = require('./windows/micro-debug/micro-debug.js')
const ConnectDeviceWindow = require('./windows/connect-device/connect-device.js')

// THEME
let currentTheme = 'default'

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

// Listen for app to be ready
app.on('ready', function(){
	// Create the Main Window
	MainWindow.Create()

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

	// Insert menu
	Menu.setApplicationMenu(mainMenu);
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
					ConnectDeviceWindow.Create()
					ConnectDeviceWindow.Theme()
				}
			},
			{
				label: 'Quit',
				accelerator: (process.platform == 'darwin') ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			},
			{
				label: 'Load Mock Settings',
				accelerator: (process.platform == 'darwin') ? 'Command+L' : 'Ctrl+L',
				click(){
					const ctrlObj = JSON.parse(fs.readFileSync('./mock-micro.json'))
					MainWindow.LoadSettings(ctrlObj)
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
							currentTheme = 'default'
							MainWindow.Theme(currentTheme)							
							MicroDebugWindow.Theme(currentTheme)
							ConnectDeviceWindow.Theme(currentTheme)
						}
					},
					{
						label: 'Light',
						click(){
							currentTheme = 'light'
							MainWindow.Theme(currentTheme)
							MicroDebugWindow.Theme(currentTheme)
							ConnectDeviceWindow.Theme(currentTheme)
						}
					},
					{
						label: 'Dark',
						click(){
							currentTheme = 'dark'
							MainWindow.Theme(currentTheme)
							MicroDebugWindow.Theme(currentTheme)
							ConnectDeviceWindow.Theme(currentTheme)
						}
					}
				]
			},
			{
				label: 'Micro Debug',
				accelerator: (process.platform == 'darwin') ? 'Command+D' : 'Ctrl+D',
				click(){
					MicroDebugWindow.Create()
					MicroDebugWindow.Theme(currentTheme)
				}
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
				label: 'Use Mock Micros',
				type: 'checkbox',
				checked: process.useMockMicros,
				accelerator: (process.platform == 'darwin') ? 'Command+M' : 'Ctrl+M',
				click(){
					process.useMockMicros = (process.useMockMicros) ? false : true
					UpdateMockSerial();
					console.log("Use Mock Micros:",process.useMockMicros)
				}
			},
			{
				role: 'reload'
			}
		]
	})
}