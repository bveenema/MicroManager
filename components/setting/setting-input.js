// Local Imports
const SettingBase = require('./setting-base.js')
const Loader = require('../loader/loader.js')

class SettingInput extends SettingBase {
	constructor(settingObj, node_id) {
		super(settingObj, node_id)
		this.min = settingObj.min
		this.max = settingObj.max
		this.unit = settingObj.unit
		this.loaders[0]
	}

	CreateDOMNode() {
		this.node = super.CreateDOMNode('setting-input.mst', {
			id: this.command,
			title: this.name,
			unit: this.unit,
			currentValue: this.currentValue,
		})
		return this.node
	}

	AttachListener(){
		this.node.addEventListener('keypress', (e) => {
			if(e.key === 'Enter') this.UpdateSetting(e.target.value)
		})
		this.node.addEventListener('keyup', (e) => {
			if(e.key === 'Escape') this.ResetInput()
		})
	}

	ValidateInput(value){
		if(value && (value >= this.min && value <= this.max)) return true
		return false
	}

	UpdateSetting(value){
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
				setTimeout(function(){ this.SetCurrentValue(this.currentValue) }.bind(this), 1000) // Mock a return from micro

				// Display the loader
				this.loaders[0].SetState('loading')
			}else{
				this.ErrorMessage.Display("Value out of range")
			}
		}
		
	}

	SetCurrentValue(value){
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