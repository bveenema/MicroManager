// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const Loader = require('../loader/loader.js')
const ErrorMessage = require('../error-message/error-message.js')

class SettingBase{
	constructor(settingObj, node_id) {
		this.name = settingObj.name
		this.type = settingObj.type
		this.command = settingObj.command
		this.nodeID = node_id
		this.loaders = []
		this.minValue = settingObj.min
		this.maxValue = settingObj.max
		this.currentValue = settingObj.default
		this.isFloat = settingObj.float
		this.floatPrecision = settingObj.floatPrecision
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
		loaders.forEach((l) => {
			// Create the loader and save it to the class
			let temp = new Loader(l)
			this.loaders.push(temp)

			// Add the LoaderID to the parent element
			l.setAttribute('id', temp.LoaderID)

			// Add the loader to the DOM and set state to idle
			l.appendChild(temp.CreateFragment())
			temp.SetState('idle')
		})

		// Create the error message
		let eMsg = node.querySelector('.error-message')
		if(eMsg) {
			this.ErrorMessage = new ErrorMessage(eMsg)
			eMsg.classList.add('invisible')
			eMsg.setAttribute('id', this.ErrorMessage.ErrorMessageID)
			eMsg.appendChild(this.ErrorMessage.CreateFragment())
			
		}

		return node
	}

	AttachListener(){}

	Init(){}
}

module.exports = SettingBase