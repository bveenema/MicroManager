// Module Imports
const fs = require('fs')
const Mustache = require('mustache')
const {ipcRenderer} = require('electron')

// Local Imports
const {ImportCSS} = require('../../util/ImportCSS')
const Loader = require('../loader/loader')

class StateBase {
	constructor(settings) {
		this.settings = settings
		this.loaders
		this.node
	}

	// Create
	// Creates a new Output instance, and initializes it
	// \param[node/fragment] container - the container the Ouput will live in
	// \param[obj] output - the output object from the micro
	static Create(container, output, mustacheFile, CSSfile) {
		// Create a new Output Instance
		let state = new this(output)

		// Attach HTML fragments
		let fragment = state.Render(mustacheFile, state.settings)

		console.log(fragment)

		// Copy the fragment
		state.node = Array.from(fragment.children)[0]

		// state.node = document.createElement('div')
		// state.node.appendChild(fragment)
		container.appendChild(fragment)

		console.log(state.node)

		// Additional Initialization functions
		state.Init()

		// add the listener
		state.AttachListener()

		// Append CSS file to the document
		ImportCSS(__dirname, CSSfile)

		// Request initial value
		ipcRenderer.send('serial:write', state.settings.command)

		// Create the update interval
		state.UpdateInterval = setInterval(function(){
			ipcRenderer.send('serial:write', state.settings.command)
		}.bind(state), state.settings.updateRate)

		return state
	}

	// Render
	// Generate the state element from the mustache file
	// \param[string] mustachFile - the file name of the template (no path)
	// \param[obj] data - the data, typically settings to load into the template
	// \return[fragment] fragment - the DOM fragment generated
	Render(mustacheFile, data){
		// load the template
		let contents = fs.readFileSync(__dirname + '/' + mustacheFile, 'utf8').toString()

		// Update the template
		let rendered = Mustache.render(contents, data)

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		// Search and create Loaders
		this.loaders = Loader.CreateLoaders(fragment)
		this.loaders.forEach((l) => {
			l.SetState('loading')
		})
		
		return fragment
	}

	// Dummy Init in case the sub-clase does not implement
	Init(){}

	// Dummy AttachListener in case the sub-class does not implement
	AttachListener(){}

	// Dummy Update in case the sub-class does not implement
	Update(){}
}

module.exports = StateBase;