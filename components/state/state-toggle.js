// Module Imports
const {ipcRenderer} = require('electron')

// Local Imports
const StateBase = require('./state-base')

class Toggle extends StateBase {
	constructor(settings) {
		super(settings)
	}

	Init(){
		this.input = this.node.querySelector('input')
	}

	AttachListener(){
		this.node.addEventListener('click', () => {
			ipcRenderer.send('serial:write', this.settings.command, this.input.checked)
			this.input.disabled = true
		})
	}

	Update(value) {
		console.log('recieved:', value)
		switch(value){
			case 'c': // checked
				this.input.checked = true
				break
			case 'u': // unchecked
				this.input.checked = false
				break
			case 'd': // disabled
				this.input.disabled = true
				break
			case 'e': // enabled
				this.input.disabled = false
				break
		}
	}

}

module.exports = Toggle