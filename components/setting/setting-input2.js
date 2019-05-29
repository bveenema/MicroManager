// Module Imports
const fs = require('fs')
const Mustache = require('mustache')
const {ipcRenderer} = require('electron')

// Local Imports
const {ImportCSS} = require('../../util/ImportCSS')
const Loader = require('../loader/loader')

let OutputID = 0

class SettingInput {
	constructor(settings) {
		this.OutputID = 'output-' + OutputID++
		this.settings = settings
		this.loaders
		this.node
	}

	// Create
	// Creates a new SettingInput instance, and initializes it
	// \param[node/fragment] container - the container the SettingInput will live in
	// \param[obj] output - the output object from the micro
	static Create(container, output) {
		// Create a new Output Instance
		let o = new Output(output)

		// Attach HTML fragments
		let fragment = o.Render({
			output: output,
			outputID: OutputID
		})

		o.node = document.createElement('div')
		o.node.appendChild(fragment)
		container.appendChild(o.node)

		// add the listener
		o.AttachListener(o.node)

		// Append CSS file to the document
		ImportCSS(__dirname, 'setting-input.css')

		// Create the update interval
		o.UpdateInterval = setInterval(function(){
			ipcRenderer.send('serial:write', o.settings.command)
		}.bind(o), 250)

		return o
	}

	AttachListener(node){

	}

	Render(data){
		// load the template
		let contents = fs.readFileSync(__dirname + '/setting-input.mst', 'utf8').toString()

		// Update the template
		let rendered = Mustache.render(contents, data)

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		// Search and create Loaders
		this.loaders = Loader.CreateLoaders(fragment)
		this.loaders[0].SetState('loading')
		
		return fragment
	}

	Update(value) {
		if(value){
			// Display the value container
			if(this.loaders[0].state === 'loading'){
				this.loaders[0].SetState('success')
				setTimeout(function(){
					this.node.querySelector('.spectrum-Label').classList.remove('invisible')
				}.bind(this), 1000)
			}

			// Update the DOM value
			let valContainer = this.node.querySelector('.spectrum-Label')
			valContainer.innerText = value

			// Update the Color
			if(value > this.settings.max || value < this.settings.min)
				this.SetColor('red')
			else
				this.SetColor('blue')
		}
	}

	SetColor(color) {
		let el = this.node.querySelector('.spectrum-Label')
		if(color === 'red'){
			el.classList.remove('spectrum-Label--green', 'spectrum-Label--blue')
			el.classList.add('spectrum-Label--red')
		}else if(color === 'green'){
			el.classList.remove('spectrum-Label--red', 'spectrum-Label--blue')
			el.classList.add('spectrum-Label--green')
		}else if(color === 'blue'){
			el.classList.remove('spectrum-Label--red', 'spectrum-Label--green')
			el.classList.add('spectrum-Label--blue')
		}
	}
}

module.exports = Output;