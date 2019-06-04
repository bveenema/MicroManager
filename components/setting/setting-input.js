// Module Imports
const {ipcRenderer} = require('electron')

// Local Imports
const SettingBase = require('./setting-base.js')

class SettingInput extends SettingBase {
	constructor(settingObj) {
		super(settingObj)
	}

	AttachListener(){
		this.node.addEventListener('keypress', (e) => {
			if(e.key === 'Enter') this.SendSetting(e.target.value)
		})
		this.node.addEventListener('keyup', (e) => {
			if(e.key === 'Escape') this.ResetInput()
		})
	}

	ValidateInput(value){
		if(value && (value >= this.settings.min && value <= this.settings.max)) return true
		return false
	}

	SendSetting(value){
		if(value){
			// Validate value
			if(this.ValidateInput(value)){
				// Don't update if value is same as currentValue
				if(value == this.currentValue){ // == instead of === as value is/may-be string
					this.ResetInput()
					return
				}
				this.ErrorMessage.Hide()
				this.currentValue = value

				// TODO send value to micro
				ipcRenderer.send('serial:write', this.settings.command, value)

				// Display the loader
				this.loaders[0].SetState('loading')
			}else{
				this.ErrorMessage.Display("Value out of range")
			}
		}
		
	}

	Update(value){
		// check if currentValue is equal to incoming value
		//	value would not be equal if update unsuccessful or has changed indepenent of app
		if(this.currentValue !== value){
			this.currentValue = value
			this.ErrorMessage.Display("Failed to update")
		}

		// if the loader is being displayed, transition back to regular display
		if(this.loaders[0].state === 'loading'){
			this.loaders[0].SetState('success')
		}

		// Update the placeholder text and display it
		this.ResetInput()
	}

	ResetInput() {
		this.node.querySelector('input').placeholder = this.currentValue
		this.node.querySelector('input').value = ''
	}
}

module.exports = SettingInput