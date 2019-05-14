// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

class Loader {
	constructor(parent) {
		this.parent = parent
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