// Module Imports
const electron = require('electron')
const {ipcRenderer} = electron

// DOM Elements
const body = document.querySelector('body')

// Handle Theme Change
ipcRenderer.on('theme:change', function(e, theme){
    console.log('updating theme:',theme)
	if(theme === 'light'){
		body.classList.remove('spectrum--light')
		body.classList.remove('spectrum--dark')
		body.classList.add('spectrum--lightest')
	}	else if(theme === 'dark'){
		body.classList.remove('spectrum--lightest')
		body.classList.remove('spectrum--light')
		body.classList.add('spectrum--dark')
	} else if(theme === 'default'){
		body.classList.remove('spectrum--lightest')
		body.classList.remove('spectrum--dark')
		body.classList.add('spectrum--light')
	}
})