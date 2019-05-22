// Module Imports
const electron = require('electron')
const {ipcRenderer} = electron

// Local Imports
const Settings = require('../../components/setting/setting-handler.js')

// DOM elements
const body = document.querySelector('body')
const mainContentOuter = document.querySelector('#main-content-outer')
const mainContentInner = document.querySelector('#main-content-inner')
const slideMenu = document.querySelector('#slide-menu')
const toggleSlideMenuButton = slideMenu.querySelector('#toggle-slide-menu')
const settingsContainer = document.querySelector('#settings')
const outputsContainer = document.querySelector('#outputs')

// Toggle State Container Listener
toggleSlideMenuButton.addEventListener('click', () => {
	slideMenu.classList.toggle("open")
	mainContentOuter.classList.toggle("drawer-open")

	const icon = toggleSlideMenuButton.querySelector('use')
	if(icon.getAttribute('xlink:href') == '#spectrum-css-icon-CrossMedium'){
		icon.setAttribute('xlink:href', '#spectrum-css-icon-ArrowLeftMedium')
	} else {
		icon.setAttribute('xlink:href', '#spectrum-css-icon-CrossMedium')
	}
	
})

// Handle settings load
ipcRenderer.on('settings:load', function(e, ctrlObj){
	if(ctrlObj){
		// clear any settings in the settings div
		settingsContainer.innerHTML = ''

		// translate the ctrlObj object
		console.log('Received ctrlObj', ctrlObj)
		ctrlObj.settings.forEach((s) =>{
			Settings.CreateSetting(s)
		})
	}
})

// Handle state load
ipcRenderer.on('state:load', function(e, ctrlObj)){
	if(ctrlObj){
		// clear any state in the drawer
		outputsContainer.innerHTML = ''

		// translate the ctrlObj
		ctrlObj.state.forEach((s) => {
			
		})
	}
}

// Handle Theme Change
ipcRenderer.on('theme:change', function(e, theme){
	if(theme === 'light'){
		body.classList.remove('spectrum--light')
		body.classList.remove('spectrum--dark')
		body.classList.add('spectrum--lightest')
		slideMenu.classList.remove('spectrum--dark')
		slideMenu.classList.remove('spectrum--darkest')
		slideMenu.classList.add('spectrum--light')
	}	else if(theme === 'dark'){
		body.classList.remove('spectrum--lightest')
		body.classList.remove('spectrum--light')
		body.classList.add('spectrum--dark')
		slideMenu.classList.remove('spectrum--light')
		slideMenu.classList.remove('spectrum--dark')
		slideMenu.classList.add('spectrum--darkest')
	} else if(theme === 'default'){
		body.classList.remove('spectrum--lightest')
		body.classList.remove('spectrum--dark')
		body.classList.add('spectrum--light')
		slideMenu.classList.remove('spectrum--light')
		slideMenu.classList.remove('spectrum--darkest')
		slideMenu.classList.add('spectrum--dark')
	}
})
