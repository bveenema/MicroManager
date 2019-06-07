// Local Imports
const SettingInput = require('./setting-input')
const SettingPicker = require('./setting-picker')
const SettingSlider = require('./setting-slider')

// DOM Elements
const SettingsContainer = document.querySelector('#settings')



module.exports = {
	Objects: [],
	
	Create: function(setting) {
		// Create a new Instance of the setting
		if(setting.type === 'input')
			this.Objects.push(SettingInput.Create(SettingsContainer, setting, 'setting-input.mst', 'setting-input.css'))
		else if(setting.type === 'picker')
			this.Objects.push(SettingPicker.Create(SettingsContainer, setting, 'setting-picker.mst', 'setting-picker.css'))
		else if(setting.type === 'slider')
			this.Objects.push(SettingSlider.Create(SettingsContainer, setting, 'setting-slider.mst', 'setting-slider.css'))
	},

	Clear: function(){
		// clear the Objects array
		this.Objects = []

		// Clear the DOM
		SettingsContainer.innerHTML = ''
	}
}
