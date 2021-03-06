// Local Imports
const StateOutput = require('./state-output')
const StateButton = require('./state-button')
const StateToggle = require('./state-toggle')
const StateProcess = require('./state-process')

// DOM Nodes
const OutputContainer = document.querySelector('#outputs ul')
const ButtonContainer = document.querySelector('#buttons div')
const ToggleContainer = document.querySelector('#toggles div')
const ProcessContainer = document.querySelector('#processes div')

module.exports = {
	Objects: [],

	Create: function(state) {
		// Create a new Instance of the state variable
		if(state.type === 'output'){
			this.Objects.push(StateOutput.Create(OutputContainer, state, 'state-output.mst', 'state-output.css'))
			// show the outputs section
			if(OutputContainer.parentNode.hasAttribute('hidden'))
				OutputContainer.parentNode.removeAttribute('hidden')

		}else if(state.type === 'button'){
			this.Objects.push(StateButton.Create(ButtonContainer, state, 'state-button.mst', 'state-button.css'))
			// show the buttons section
			if(ButtonContainer.parentNode.hasAttribute('hidden'))
				ButtonContainer.parentNode.removeAttribute('hidden')

		}else if(state.type === 'toggle'){
			this.Objects.push(StateToggle.Create(ToggleContainer, state, 'state-toggle.mst', 'state-toggle.css'))
			// show the toggles section
			if(ToggleContainer.parentNode.hasAttribute('hidden'))
				ToggleContainer.parentNode.removeAttribute('hidden')
				
		}else if(state.type === 'process'){
			this.Objects.push(StateProcess.Create(ProcessContainer, state, 'state-process.mst', 'state-process.css'))
			// show the toggles section
			if(ProcessContainer.parentNode.hasAttribute('hidden'))
				ProcessContainer.parentNode.removeAttribute('hidden')
		}
	},

	Clear: function(){
		// Kill the update intervals
		this.Objects.forEach((o) => {
			o.Kill()
		})

		// clear the Objects array
		this.Objects = []

		// Clear the DOM
		OutputContainer.innerHTML = ''
		ProcessContainer.innerHTML = ''
		ToggleContainer.innerHTML = ''
		ButtonContainer.innerHTML = ''
	}
}
