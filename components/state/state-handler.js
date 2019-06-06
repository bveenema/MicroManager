// Local Imports
const StateOutput = require('./state-output')
const StateButton = require('./state-button')

// DOM Nodes
const OutputContainer = document.querySelector('#outputs ul')
const ButtonContainer = document.querySelector('#buttons div')

module.exports = {
	Objects: [],

	CreateState: function(state) {
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
		}
			
	}
}
