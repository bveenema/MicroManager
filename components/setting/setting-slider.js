// Local Imports
const SettingBase = require('./setting-base.js')
const Loader = require('../loader/loader.js')

class SettingSlider extends SettingBase {
	constructor(settingObj, node_id) {
		super(settingObj, node_id)
		this.options = settingObj.options
		this.pickerState = 'closed'
		this.currentValue = settingObj.default
	}

	CreateDOMNode() {
		return super.CreateDOMNode('setting-slider.mst', {
			title: this.name,
			currentValue: this.currentValue,
			nodeID: this.nodeID,
		})
	}

	Init(node) {
		this.leftTrack = node.querySelectorAll('.spectrum-Slider-track')[0]
		this.rightTrack= node.querySelectorAll('.spectrum-Slider-track')[1]
		this.handle = node.querySelector('.spectrum-Slider-handle')
		this.valueOut = slider.querySelector('.spectrum-Slider-value')
	}

	MoveSlider(e) {
		
	}

	AttachListener(node){
		
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

module.exports = SettingSlider