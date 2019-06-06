// Module Imports
const {ipcRenderer} = require('electron')

// Local Imports
const StateBase = require('./state-base')

class Button extends StateBase {
	constructor(settings) {
		super(settings)
	}

	Init(){
		if(this.settings.buttonType === 'primary')
			this.node.classList.add('spectrum-Button--primary')
		else if(this.settings.buttonType === 'warning'){
			this.node.classList.add('spectrum-Button--warning')
		}
	}

	AttachListener(){
		this.node.addEventListener('click', () => {
			ipcRenderer.send('serial:write', this.settings.command, true)
			this.node.setAttribute('disabled', '')
		})
	}

	Update(value) {
		if(value == 'true'){
			this.node.removeAttribute('disabled', true)
		}else{
			this.node.setAttribute('disabled', '')
		}
	}
}

module.exports = Button