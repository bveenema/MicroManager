// Module Imports
const electron = require('electron')
const {ipcRenderer} = electron

// Local Imports
const DeviceSelector = require('../../components/device-selector/device-selector.js')

// DOM Elements
const body = document.querySelector('body')
const deviceContainer = document.querySelector('#device-content')

let DeviceSelectors = []

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

// Handle Retrieve Serial Devices
ipcRenderer.on('serial:devices', function(e, devices, path){
	// Resize the window based on number of devices
	window.resizeTo(window.outerWidth, 140+38*(devices.length-1))

	// Clear the current device list
	deviceContainer.innerHTML = ''
	DeviceSelectors = []

	// Create a device element for each device
	devices.forEach((device) => {
		DeviceSelectors.push(DeviceSelector.Create(deviceContainer, device))
	})

	// Highlight device if already connected
	if(path){
		DeviceSelectors.forEach((Device) => {
			console.log(Device.device)
			if(Device.device.comName === path){
				Device.node.querySelector('input').checked = true
			}
		})
	}
})