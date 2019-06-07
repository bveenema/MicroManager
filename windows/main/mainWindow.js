// Module Imports
const electron = require('electron')
const {ipcRenderer} = electron

// Local Imports
const Settings = require('../../components/setting/setting-handler')
const State = require('../../components/state/state-handler')

// DOM elements
const Body = document.querySelector('Body')
const MainContentOuter = document.querySelector('#main-content-outer')
const SlideMenu = document.querySelector('#slide-menu')
const ToggleSlideMenuButton = SlideMenu.querySelector('#toggle-slide-menu')
const SlideMenuIcon = ToggleSlideMenuButton.querySelector('use')
const ConnectMessage = document.querySelector('#connect-message')

// Toggle State Container Listener
function ToggleSlideMenu(){
	SlideMenu.classList.toggle("open")
	MainContentOuter.classList.toggle("drawer-open")

	if(SlideMenuIcon.getAttribute('xlink:href') == '#spectrum-css-icon-CrossMedium'){
		SlideMenuIcon.setAttribute('xlink:href', '#spectrum-css-icon-ArrowLeftMedium')
	} else {
		SlideMenuIcon.setAttribute('xlink:href', '#spectrum-css-icon-CrossMedium')
	}
}

ToggleSlideMenuButton.addEventListener('click', ToggleSlideMenu)

// Handle settings load
ipcRenderer.on('settings:build', (e, settings) => {
	if(settings){
		// Hide the connect message
		ConnectMessage.style = 'display: none'

		// clear any old settings objects
		Settings.Clear()

		// Build Settings
		settings.forEach((s) =>{
			Settings.Create(s)
		})
	}
})

// Handle state load
ipcRenderer.on('state:build', (e, state) => {
	if(state){
		// Show the drawer
		SlideMenu.classList.add("open")
		MainContentOuter.classList.add("drawer-open")
		SlideMenuIcon.setAttribute('xlink:href', '#spectrum-css-icon-CrossMedium')

		// Clear any old state objects
		State.Clear()

		// Build the new state objects
		state.forEach((s) => {
			State.Create(s)
		})
	}
})

// Hande Name Update
ipcRenderer.on('name:update', (e, name) => {
	if(name){
		// Update the device name
		document.querySelector('#device-name').innerText = name
	}
})

// Handle serial write reply
ipcRenderer.on('serial:wrote', (e, command, value) => {
	// Check State Objects for a match
	let StateObj = State.Objects.find((o) => {
		return o.settings.command === command
	})
	if(StateObj){
		StateObj.Update(value)
	}

	// Only check Setting Objects if no state objects matched
	else{
		let SettingObj = Settings.Objects.find((o) =>{
			return o.settings.command === command
		})
		if(SettingObj){
			SettingObj.Update(value)
		}
	}
})

// Handle Theme Change
ipcRenderer.on('theme:change', function(e, theme){
	if(theme === 'light'){
		Body.classList.remove('spectrum--light')
		Body.classList.remove('spectrum--dark')
		Body.classList.add('spectrum--lightest')
		SlideMenu.classList.remove('spectrum--dark')
		SlideMenu.classList.remove('spectrum--darkest')
		SlideMenu.classList.add('spectrum--light')
	}	else if(theme === 'dark'){
		Body.classList.remove('spectrum--lightest')
		Body.classList.remove('spectrum--light')
		Body.classList.add('spectrum--dark')
		SlideMenu.classList.remove('spectrum--light')
		SlideMenu.classList.remove('spectrum--dark')
		SlideMenu.classList.add('spectrum--darkest')
	} else if(theme === 'default'){
		Body.classList.remove('spectrum--lightest')
		Body.classList.remove('spectrum--dark')
		Body.classList.add('spectrum--light')
		SlideMenu.classList.remove('spectrum--light')
		SlideMenu.classList.remove('spectrum--darkest')
		SlideMenu.classList.add('spectrum--dark')
	}
})
