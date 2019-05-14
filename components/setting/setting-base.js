// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const Loader = require('../loader/loader.js')

class SettingBase{
	constructor(settingObj, node_id) {
		this.name = settingObj.name
		this.type = settingObj.type
		this.command = settingObj.command
		this.nodeID = node_id
	}

	CreateDOMNode(template, attributes) {
		// load the template
		let contents = fs.readFileSync(__dirname + '\\' + template, 'utf8').toString()
		console.log()

		// Update the template
		let rendered =  Mustache.render(contents, attributes)
		console.log(rendered)

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		// create an empty setting nod and append the fragment
		let node = document.createElement('div')
		node.classList.add('setting')
		node.setAttribute('id', this.nodeID)
		node.appendChild(fragment)

		// Search for 'component-loader' divs
		let loaders = node.querySelectorAll('.component-loader');

		// Create a Loader instance for each div
		loaders.forEach((l) => {
			this.loader = new Loader(l)
			l.appendChild(this.loader.CreateFragment())
			this.loader.SetState('idle')
		})

		return node
	}

	AttachListener(){}

	// Toggle the error message
	ToggleErrorLabel(message){
		let node = document.getElementById(this.nodeID)
		let el = node.querySelector('.setting-error-message')
		if(message){
			el.querySelector('span').innerText = message
			el.classList.remove('invisible')
		} else {
			el.classList.add('invisible')
		}
	}
}

module.exports = SettingBase