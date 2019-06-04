// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const {ImportCSS} = require('../../util/ImportCSS')

let LoaderID = 0

class Loader {
	constructor(parent) {
		this.parent = parent
		this.LoaderID = 'loader-' + LoaderID++
		this.currentState = 'idle'
	}

	// Create Loaders
	// Searches a node for '.component-loader' divs and returns new instances for each
	// \param[node/fragment] node - a node or fragment that may contain a '.component-loader' div
	static CreateLoaders(node) {
		if(node){
			// find any/all divs containing component-loader class
			let loaderDivs = node.querySelectorAll('.component-loader')

			if(loaderDivs.length > 0){
				// Create new Loader instances
				let loaders = []
				loaderDivs.forEach((loader) => {
					loaders.push(new Loader(loader))
				})

				// Attach HTML fragments and add Loader ID
				loaders.forEach((Loader, i) => {
					let fragment = Loader.CreateFragment()
					loaderDivs[i].appendChild(fragment)
					loaderDivs[i].setAttribute('id', Loader.LoaderID)
					Loader.SetState('idle')
				})

				// Append CSS file to the document
				ImportCSS(__dirname, 'loader.css')

				return loaders
			}
		}
	}


	SetState(state) {
		if(state === 'idle'){
			this.parent.querySelector('.setting-circle-loader').classList.add('invisible')
			this.parent.querySelector('.setting-success-icon').classList.add('invisible')
			this.parent.querySelector('.setting-circle-loader').setAttribute('hidden', '')
		}else if(state === 'loading'){
			this.parent.querySelector('.setting-circle-loader').removeAttribute('hidden')
			this.parent.querySelector('.setting-circle-loader').classList.remove('invisible')
			this.parent.querySelector('.setting-success-icon').classList.add('invisible')
		}else if (state === 'success'){
			this.parent.querySelector('.setting-circle-loader').classList.add('invisible')
			this.parent.querySelector('.setting-success-icon').classList.remove('invisible')
			setTimeout(function(){this.SetState('idle')}.bind(this), 1000)
		}
		this.currentState = state
	}

	get state() {
		return this.currentState
	}

	CreateFragment(){
		// load the template
		let contents = fs.readFileSync(__dirname + '/loader.mst', 'utf8').toString()

		// Update the template
		let rendered = Mustache.render(contents)

		// convert the rendered template to a document fragment
		let fragment = document.createRange().createContextualFragment(rendered)

		return fragment
	}
}

module.exports = Loader;