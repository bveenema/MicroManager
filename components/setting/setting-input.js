// Local Imports
const SettingBase = require('./setting-base.js')
const Loader = require('../loader/loader.js')

class SettingInput extends SettingBase {
	constructor(settingObj, node_id) {
		super(settingObj, node_id)
		this.min = settingObj.min
		this.max = settingObj.max
		this.unit = settingObj.unit
		this.currentState = 'idle'
		this.loaders[0]
	}

	CreateDOMNode() {
		return super.CreateDOMNode('setting-input.mst', {
			id: this.command,
			title: this.name,
			unit: this.unit,
			currentValue: '',
		})
	}

	AttachListener(node){
		node.addEventListener('keypress', (e) => {
			if(e.key === 'Enter') this.UpdateSetting(e.target.value)
		})
	}

	ValidateInput(value){
		if(value >= this.min && value <= this.max) return true
		return false
	}

	UpdateSetting(value){
		console.log('State: '+ this.currentState)
		switch(this.currentState){
			case 'idle':
				// Check for a valid value
				if(this.ValidateInput(value) == false){
					this.currentState = 'value-invalid'
					this.UpdateSetting()
					break;
				}

				// hide the error label if displayed
				this.ToggleErrorLabel()

				// TODO send value to micro
				setTimeout(function(){ this.UpdateSetting() }.bind(this), 1000) // Mock a return from micro
				
				// Display the loading icon
				this.loaders[0].SetState('loading')

				this.currentState = 'updating'
				break

			case 'updating':
				// TODO receive return from micro

				// Change loader to success state
				this.loaders[0].SetState('success')

				this.currentState = 'idle'
				break

			case 'value-invalid':
				this.ToggleErrorLabel("Value out of range")
				setTimeout(function(){ this.ToggleErrorLabel() }.bind(this), 5000)
				this.currentState = 'idle'

			default:
				this.currentState = 'idle'
		}
	}
}

module.exports = SettingInput