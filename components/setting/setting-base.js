// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const {ImportCSS} = require('../../util/ImportCSS')
const Loader = require('../loader/loader.js')
const ErrorMessage = require('../error-message/error-message.js')

class SettingBase{
	constructor(settings) {
		this.settings = settings
		this.loaders
		this.node
	}

	// Create
	// Runs all the functions necessary to create, initialize and load the setting into the DOM
	// \param[node/fragment] container - the DOM element the setting is contained in
	// \param[obj] settings - the settings object from the micro for this setting
	// \param[string] mustachFile - the file name of the mustache template (no path & must be same folder)
	// \param[string] cssFile = the file name of the CSS file (no path & must be same folder)
	static Create(container, settings, mustacheFile, cssFile) {
		// Create a new SettingSlider Instance
		let s = new this(settings)

		// Attach HTML fragments
		let fragment = s.Render(mustacheFile)
		s.node = document.createElement('div')
		s.node.classList.add('setting', 'spectrum-Well')
		s.node.appendChild(fragment)
		container.appendChild(s.node)

		// Initialize
		s.Init()

		// Add Listeners
		s.AttachListener()

		// Append CSS file to the document
		ImportCSS(__dirname, cssFile)

		return s
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

		// Create the error message
		this.ErrorMessage = ErrorMessage.Create(fragment)
		
		return fragment
	}
	
	AttachListener(){}

	Init(){}

	Update(value){
		console.log("Update Setting", value)
	}
}

module.exports = SettingBase