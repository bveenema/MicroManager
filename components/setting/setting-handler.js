const electron = require('electron')
const {ipcRenderer} = electron

// Local Imports
const SettingInput = require('./setting-input')
const SettingPicker = require('./setting-picker')
const SettingSlider = require('./setting-slider')

// DOM Elements
const settingsContainer = document.querySelector('#settings')

let nodeIDCount = 0

module.exports = {
	Objects: [],
	
	CreateSetting: function(setting) {
		// Create a new Instance of the setting
		if(setting.type === 'input')
			this.Objects.push(SettingInput.Create(settingsContainer, setting, 'setting-input.mst', 'setting-input.css'))
		else if(setting.type === 'picker')
			this.Objects.push(SettingPicker.Create(settingsContainer, setting, 'setting-picker.mst', 'setting-picker.css'))
		else if(setting.type === 'slider')
			this.Objects.push(SettingSlider.Create(settingsContainer, setting, 'setting-slider.mst', 'setting-slider.css'))
	}
}
