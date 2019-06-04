// Module Imports
const {ipcRenderer} = require('electron')

// Local Imports
const SettingBase = require('./setting-base.js')

class SettingPicker extends SettingBase {
	constructor(settingObj) {
		super(settingObj)
		this.options = settingObj.options
		this.pickerState = 'closed'
		this.currentValue = settingObj.default
	}

	AttachListener(){
		this.node.querySelector('button').addEventListener('click', (e) => {
			this.TogglePicker()
		})
		this.node.querySelectorAll('li').forEach((el, i) => {
			el.addEventListener('click', (e) => {
				this.SendSetting(e.target)
			})
			el.addEventListener('keypress', (e) => {
				if(e.key === "Enter")
					this.SendSetting(e.target)
			})
		})
	}

	TogglePicker(){
		this.node.querySelector('.spectrum-Dropdown').classList.toggle('is-open')
		this.node.querySelector('.spectrum-Dropdown-trigger').classList.toggle('is-selected')
		this.node.querySelector('.spectrum-Dropdown-popover').classList.toggle('is-open')
		this.pickerState = (this.pickerState === 'closed') ? 'open' : 'closed'
	}

	// Send Setting
	// Validates and sends the new setting to the micro
	// \param[node] node - the DOM node that was clicked on
	SendSetting(node){
		// Walk up the DOM to the li element
		while(node.localName !== 'li')
			node = node.parentElement

		let value = node.innerText

		// Validate Input
		if(value === this.currentValue) return

		// TODO send  value to micro
		// setTimeout(function(){ this.Update(value) }.bind(this), 1000)
		ipcRenderer.send('serial:write', this.settings.command, value)
		
		// Display the loading icon
		let loaderNode = node.querySelector('.component-loader')
		this.loaders.forEach((l) => {
			if(loaderNode.id === l.LoaderID)
				l.SetState('loading')
		})
	}

	// Update
	// Update the current value, called when the micro responds to a new setting or sends
	// a new setting on its own
	// \param[number/string] value: the new value to update the setting with
	Update(value){

		this.currentValue = value

		// Find the li with the corresponding value
		let li
		let elements = this.node.querySelectorAll('li')
		elements.forEach((el) => {
			if(el.id.includes(value)) li = el
		})
				
		// Set the loader node to success
		let loaderNode = li.querySelector('.component-loader')
		this.loaders.forEach((l) => {
			if(loaderNode.id === l.LoaderID)
				l.SetState('success')
		})

		// Delay, then close the picker, update the current value and set the selected item
		setTimeout(function(){
			if(this.pickerState === 'open') this.TogglePicker()
			elements.forEach((el) => {
				el.classList.remove('is-selected')
			})
			li.classList.add('is-selected')
			this.node.querySelector('.spectrum-Dropdown-label').innerText = value
		}.bind(this), 1000)
	}
}

module.exports = SettingPicker