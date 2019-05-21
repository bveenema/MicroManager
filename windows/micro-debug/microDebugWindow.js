// Module Imports
const electron = require('electron')
const {ipcRenderer} = electron

// DOM Elements
const body = document.querySelector('body')
const debugContent = document.querySelector('#debug-content')

// Handle add debug message
ipcRenderer.on('micro:debug', function(e, message){
    if(message){
		// Detect if scrollbar is at bottom
		const isScrolledToBottom = debugContent.scrollHeight -debugContent.clientHeight <= debugContent.scrollTop + 1
		
		// Add the new message
		let newMessage = document.createElement('div')
        newMessage.innerText = message
		debugContent.appendChild(newMessage)
		
		// keep scrollbar at bottom if it was already there
		if(isScrolledToBottom) {
			debugContent.scrollTop = debugContent.scrollHeight - debugContent.clientHeight
		}
    }
})

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