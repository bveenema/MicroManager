// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const Loader = require('../loader/loader')

let DeviceSelectorID = 0

class DeviceSelector {
	constructor(parent) {
		this.parent = parent
        this.DeviceSelectorID = 'device-selector-' + DeviceSelectorID++
        this.Init()
	}

	Init(){
        let ownerDocument = this.parent.ownerDocument

		// Add the CSS file to the head
		var css = document.createElement('link')
		css.href = '../../components/device-selector/device-selector.css'
		css.type = "text/css"
        css.rel = "stylesheet"
		 
		ownerDocument.getElementsByTagName('head')[0].appendChild(css)
	}

	CreateFragment(device){
		// load the template
		let contents = fs.readFileSync(__dirname + '/device-selector.mst', 'utf8').toString()

        // Update the template
        console.log(device)
		let rendered = Mustache.render(contents, {
            device: device
        })

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		this.loaders = Loader.CreateLoaders(fragment)
		

		return fragment
	}
}

module.exports = DeviceSelector;