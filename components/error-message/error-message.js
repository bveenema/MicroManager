// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

let ErrorMessageID = 0

class ErrorMessage {
	constructor(node) {
		this.node = node
		this.ErrorMessageID = 'ErrorMessage-' + ErrorMessageID++
	}

	// Display
	// Show the error message. Auto-hide after displayTime or 5 seconds
	// \param[string] message - the message to be displayed
	// \param[int] displayTime - the amount of time to display the message
	Display(message, displayTime) {
		if(message){
			this.node.querySelector('.spectrum-Label').innerText = message
			this.node.classList.remove('invisible')
			setTimeout(function(){
				this.node.classList.add('invisible')
			}.bind(this), (displayTime) ? displayTime : 5000)
		}
	}

	// Hide
	// Hides the error message if shown.
	Hide(){
		this.node.classList.add('invisible')
	}

	CreateFragment(){
		// load the template
		let contents = fs.readFileSync(__dirname + '/error-message.mst', 'utf8').toString()

		// Update the template
		let rendered = Mustache.render(contents,{})

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		return fragment
	}
}

module.exports = ErrorMessage;