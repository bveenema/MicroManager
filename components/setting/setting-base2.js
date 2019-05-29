// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const Loader = require('../loader/loader.js')
const ErrorMessage = require('../error-message/error-message.js')

class SettingBase{
	constructor(settings) {
		this.settings = settings
		this.loaders
		this.node
	}

	Render(mustacheFile){
		// load the template
		let contents = fs.readFileSync(__dirname + '/' + mustacheFile, 'utf8').toString()

		// Update the template
		let rendered = Mustache.render(contents, this.settings)

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		// Search and create Loaders
		this.loaders = Loader.CreateLoaders(fragment)
		this.loaders[0].SetState('loading')

		// Search and create error message
		let eMsg = node.querySelector('.error-message')
		if(eMsg) {
			this.ErrorMessage = new ErrorMessage(eMsg)
			eMsg.classList.add('invisible')
			eMsg.setAttribute('id', this.ErrorMessage.ErrorMessageID)
			eMsg.appendChild(this.ErrorMessage.CreateFragment())
			
		}
		
		return fragment
	}

	CreateDOMNode(template, attributes) {
		// load the template
		let contents = fs.readFileSync(__dirname + '\\' + template, 'utf8').toString()

		// Update the template
		let rendered =  Mustache.render(contents, attributes)

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		// create an empty setting nod and append the fragment
		let node = document.createElement('div')
		node.classList.add('setting')
		node.setAttribute('id', this.nodeID)
		node.appendChild(fragment)

		// Search for 'component-loader' divs
		let loaders = node.querySelectorAll('.component-loader')

		// Create a Loader instance for each div
		this.loaders = Loader.CreateLoaders(node)

		// Create the error message
		this.ErrorMessage = ErrorMessage.Create(node)

		return node
	}

	AttachListener(){}

	Init(){}

	Update(value){
		console.log("Update Setting", value)
	}
}

module.exports = SettingBase