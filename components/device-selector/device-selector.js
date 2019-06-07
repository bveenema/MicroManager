// Module Imports
const fs = require('fs')
const Mustache = require('mustache')
const {ipcRenderer} = require('electron')

// Local Imports
const {ImportCSS} = require('../../util/ImportCSS')
const Loader = require('../loader/loader')

let DeviceSelectorID = 0

class DeviceSelector {
	constructor(device) {
		this.DeviceSelectorID = 'device-selector-' + DeviceSelectorID++
		this.device = device
		this.loaders
		this.node
	}

	// Create
	// Creates a new Devices Selector instance, and initializes it
	// \param[node/fragment] node - a node or fragment that may contain a '.component-loader' div
	static Create(container, device) {
		// Create a new Device Selector Instance
		let ds = new DeviceSelector(device)

		// Attach HTML fragments
		let fragment = ds.Render(device)

		ds.node = document.createElement('div')
		ds.node.appendChild(fragment)
		container.appendChild(ds.node)

		// add the listener
		ds.AttachListener(fragment)


		// Append CSS file to the document
		ImportCSS(__dirname, 'device-selector.css')

		return ds
	}

	AttachListener(node){
		this.node.addEventListener('click', (e) => {
			// Show the loader
			this.loaders[0].SetState('loading')

			// Request to open device
			ipcRenderer.send('serial:open', this.device)

			// handle device opened
			ipcRenderer.once('serial:opened', (e, success) => {
				if(success) this.loaders[0].SetState('success')
			})
		})
	}

	Render(device){
		// load the template
		let contents = fs.readFileSync(__dirname + '/device-selector.mst', 'utf8').toString()

		// Update the template
		let rendered = Mustache.render(contents, {
			device: device
		})

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		// Search and create Loaders
		this.loaders = Loader.CreateLoaders(fragment)
		
		return fragment
	}
}

module.exports = DeviceSelector;