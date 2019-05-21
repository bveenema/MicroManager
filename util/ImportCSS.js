// Module Imports
const url = require('url')
const path = require('path')

let ImportCSSTimer = 0

module.exports = {
	ImportCSS: function(directory, file){
		setTimeout(function(){
			// Reset ImportCSSTimer
			ImportCSSTimer = 0

			// Check if CSS file already present
			let cssFiles = document.styleSheets
			let hasCSSFile = false
			for(let i=0; i< cssFiles.length; i++){
				if(cssFiles[i].ownerNode.id === file) hasCSSFile = true
			}

			// Add CSS file if no present
			if(hasCSSFile == false) {
				// Create the path
				let filePath = url.format({
					pathname: path.join(directory, file),
					protocol: 'file:',
					slashes: true
				})

				// Create css node
				var css = document.createElement('link')
					css.href = filePath
					css.type = "text/css"
					css.rel = "stylesheet"
					css.id = 'loader.css'

				// append css node
				document.getElementsByTagName('head')[0].appendChild(css)
			}
		}, ImportCSSTimer)
		ImportCSSTimer += 5
	}
}