// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const {ImportCSS} = require('../../util/ImportCSS')

class ErrorMessage {
	constructor(node) {
		this.node = node
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

	// Create Error Message
	// Searches a node for an '.error-message' div and returns a new instance of ErrorMessage
	// \param[node/fragment] node - a node or fragment that may contain a '.error-message' div
	static Create(node){
		if(node){
			// find the div containing error-message class
			let errorDiv = node.querySelector('.error-message')
			if(errorDiv) {
				// create new Error message Instance
				let eMsg = new ErrorMessage(errorDiv)

				// Initialize Error div
				errorDiv.classList.add('invisible')

				// Attach HTML fragme
				errorDiv.appendChild(eMsg.CreateFragment())

				// Append CSS file to the document
				ImportCSS(__dirname, 'error-message.css')

				return eMsg
			}
		}
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