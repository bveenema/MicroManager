const electron = require('electron')
const {ipcRenderer} = electron

// Local Imports
const SettingInput = require('./setting-input')
const SettingPicker = require('./setting-picker')

let nodeIDCount = 0

module.exports = {
	CreateSetting: function(setting) {

		// Create a new Instance of the setting
		let temp
		if(setting.type === 'input')
			temp = new SettingInput(setting, nodeIDCount++)
		else if(setting.type === 'picker')
			temp = new SettingPicker(setting, nodeIDCount++)

		// Create a DOM Node
		let node = temp.CreateDOMNode()
		
		// Attach a listener
		temp.AttachListener(node)
	
		// Attach the node to the setting div
		document.getElementById('settings').appendChild(node)
	}
}
