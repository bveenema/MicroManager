// Local Imports
const SettingBase = require('./setting-base.js')

class SettingPicker extends SettingBase {
	constructor(settingObj) {
		super(settingObj)
		this.options = settingObj.options
		this.pickerState = 'closed'
		this.currentValue = settingObj.default
		this.loaders = []
	}

	AttachListener(){
		this.node.querySelector('button').addEventListener('click', (e) => {
			this.TogglePicker()
		})
		this.node.querySelectorAll('li').forEach((el, i) => {
			el.addEventListener('click', (e) => {
				this.UpdateSetting(e.target)
			})
			el.addEventListener('keypress', (e) => {
				if(e.key === "Enter")
					this.UpdateSetting(e.target)
			})
		})
	}

	TogglePicker(){
		this.node.querySelector('.spectrum-Dropdown').classList.toggle('is-open')
		this.node.querySelector('.spectrum-Dropdown-trigger').classList.toggle('is-selected')
		this.node.querySelector('.spectrum-Dropdown-popover').classList.toggle('is-open')
		this.pickerState = (this.pickerState === 'closed') ? 'open' : 'closed'
	}

	UpdateSetting(node){
		// Walk up the DOM to the li element
		while(node.localName !== 'li')
			node = node.parentElement

		let value = node.innerText

		// Validate Input
		if(value === this.currentValue) return

		// TODO send  value to micro
		setTimeout(function(){ this.SetCurrentValue(value) }.bind(this), 1000)
		
		// Display the loading icon
		let loaderNode = node.querySelector('.component-loader')
		this.loaders.forEach((l) => {
			if(loaderNode.id === l.LoaderID)
				l.SetState('loading')
		})
	}

	SetCurrentValue(value){

		this.currentValue = value

		let node = document.getElementById(this.nodeID)

		// Find the li with the corresponding value
		let li
		let elements = node.querySelectorAll('li')
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
			node.querySelector('.spectrum-Dropdown-label').innerText = value
		}.bind(this), 1000)
	}
}

module.exports = SettingPicker