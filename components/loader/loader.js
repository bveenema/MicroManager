// Module Imports
const fs = require('fs')
const Mustache = require('mustache')
const url = require('url')
const path = require('path')

let LoaderID = 0
let AppendCSSCount = 0

class Loader {
	constructor(parent) {
		this.parent = parent
		this.LoaderID = 'loader-' + LoaderID++
		this.currentState = 'idle'
	}

	// Create Loaders
	// Serches a node for '.component-loader' divs and returns new instances for each
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

				// Attach HTML fragments
				loaders.forEach((Loader, i) => {
					let fragment = Loader.CreateFragment()
					loaderDivs[i].appendChild(fragment)
					Loader.SetState('idle')
				})

				// Append CSS file to the document, stagger timing to prevent multiple adds of same file
				setTimeout(function(){ 
					Loader.AppendCSS(url.format({
						pathname: path.join(__dirname, 'loader.css'),
						protocol: 'file:',
						slashes: true
					}))
				}, AppendCSSCount)
				AppendCSSCount += 5

				return loaders
			}
		}
	}

	static AppendCSS(file){
		// Reset AppendCSSCount
		AppendCSSCount = 0

		// Check if CSS file alreay present
		let cssFiles = document.styleSheets
		let hasCSSFile = false
		for(let i=0; i< cssFiles.length; i++){
			console.log(cssFiles[i].href)
			if(cssFiles[i].href.includes(file)) hasCSSFile = true
		}

		console.log(hasCSSFile)
		// Add CSS file if no present
		if(hasCSSFile == false) {
			var css = document.createElement('link')
				css.href = file
				css.type = "text/css"
				css.rel = "stylesheet"
			document.getElementsByTagName('head')[0].appendChild(css)
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

	Init(window){
		// Add the CSS file to the head
		var css = document.createElement('css')
		css.href = '../../components/loader/loader.css'
		css.type = "text/css"
		css.rel = "stylesheet"
		 
		window.getElementsByTagName('head')[0].appendChild(css)

		// Create and return the fragment
		return CreateFragment()
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