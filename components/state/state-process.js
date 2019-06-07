// Module Imports
const {clamp, round} = require('lodash')

// Local Imports
const StateBase = require('./state-base')

class Process extends StateBase {
	constructor(settings) {
		super(settings)
		this.currentValue = 0
	}

	Update(value) {
		if(value){
			// Convert to whole number and clamp to 0-100%
			let percentage = round(clamp(parseInt(value), 0, 100))

			// Only update DOM if current value has changed
			if(this.currentValue !== percentage){
				this.currentValue = percentage

				// Update the text percentage
				this.node.querySelector('.spectrum-BarLoader-percentage').innerText = percentage + '%'

				// Update the fill
				this.node.querySelector('.spectrum-BarLoader-fill').style.width = percentage + '%'
			}
		}
	}
}

module.exports = Process;