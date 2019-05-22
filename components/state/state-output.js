// Module Imports
const fs = require('fs')
const Mustache = require('mustache')
const {ipcRenderer} = require('electron')

// Local Imports
const {ImportCSS} = require('../../util/ImportCSS')
const Loader = require('../loader/loader')

let OutputID = 0

class Output {
	constructor(output) {
		this.OutputID = 'output-' + OutputID++
		this.output = output
		this.loaders
		this.node
	}

	// Create
	// Creates a new Output instance, and initializes it
	// \param[node/fragment] container - the container the Ouput will live in
	// \param[obj] output - the output object from the micro
	static Create(container, output) {
		// Create a new Output Instance
		let o = new Output(output)

		// Attach HTML fragments
		let fragment = o.Render(output)

		o.node = document.createElement('div')
		o.node.appendChild(fragment)
		container.appendChild(o.node)

		// add the listener
		o.AttachListener(fragment)

		// Append CSS file to the document
		ImportCSS(__dirname, 'output.css')

		return o
	}

	AttachListener(node){

	}

	Render(data){
		// load the template
		let contents = fs.readFileSync(__dirname + '/output.mst', 'utf8').toString()

		// Update the template
		let rendered = Mustache.render(contents, {
			data: data
		})

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		// Search and create Loaders
		this.loaders = Loader.CreateLoaders(fragment)
		
		return fragment
	}
}

module.exports = Output;