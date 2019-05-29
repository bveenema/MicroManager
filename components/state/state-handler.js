// Local Imports
const StateOutput = require('./state-output')

// DOM Nodes
const OutputContainer = document.querySelector('#outputs ul')

module.exports = {
	Objects: [],

	CreateState: function(state) {
		// Create a new Instance of the state variable
		if(state.type === 'output')
			this.Objects.push(StateOutput.Create(OutputContainer, state))
	}
}
