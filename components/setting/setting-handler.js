const electron = require('electron')
const {ipcRenderer} = electron

// Local Imports
const SettingInput = require('./setting-input')
const SettingPicker = require('./setting-picker')
const SettingSlider = require('./setting-slider')

let nodeIDCount = 0

module.exports = {
	CreateSetting: function(setting) {

		// Create a new Instance of the setting
		let temp
		if(setting.type === 'input')
			temp = new SettingInput(setting, nodeIDCount++)
		else if(setting.type === 'picker')
			temp = new SettingPicker(setting, nodeIDCount++)
		else if(setting.type === 'slider')
			temp = new SettingSlider(setting, nodeIDCount++)

		// Create a DOM Node
		let node = temp.CreateDOMNode()

		// Initialize the Setting
		temp.Init(node)
		
		// Attach a listener
		temp.AttachListener(node)
	
		// Attach the node to the setting div
		document.getElementById('settings').appendChild(node)
	}
}
