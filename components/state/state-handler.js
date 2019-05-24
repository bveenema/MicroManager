// Local Imports
const StateOutput = require('./state-output')

// DOM Nodes
const OutputContainer = document.querySelector('#outputs ul')

let State = []

module.exports = {
	CreateState: function(state) {
		// Create a new Instance of the setting
		if(state.type === 'output')
			State.push(StateOutput.Create(OutputContainer, state))
	}
}
