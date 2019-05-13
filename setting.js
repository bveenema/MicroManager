const electron = require('electron')
const {ipcRenderer} = electron






const fs = require('fs')
const Mustache = require('mustache')

function loadSetting(){

	let contents = fs.readFileSync('./components/setting-input.mst').toString()

	let rendered = Mustache.render(contents, 
		{
			id: 'test',
			title: 'Test',
			currentValue: '',
		}
	)

	let fragment = document.createRange().createContextualFragment(rendered)
	console.log(fragment)

	document.getElementById('settings').appendChild(fragment)

}

loadSetting()









let settings = []
const settings_NodeList = document.querySelectorAll('.setting')
console.log(settings_NodeList);

// Attach a listener to each setting
settings_NodeList.forEach((s) => {
	if(s.classList.contains('setting-input')){
		s.addEventListener('keypress', InputListener.bind(s))
	}else if(s.classList.contains('setting-dropdown')){
		s.addEventListener('click', DropDownListener)
		s.addEventListener('keypress', DropDownListener)
	}
		
})

function InputListener(e){
	if(e.key === 'Enter'){
		console.log(e)
		// find the matching setting
		if(settings){
			settings.forEach((setting) => {
				console.log(setting.id, e.target.id)
				if(e.target.id === setting.node.id){
					setting.updateSetting(e.target.value);
				}
			})
		}
	}
}

function DropDownListener(e) {
	if(e.key === 'Enter'){
		console.log('Enter Key Pressed')
	}
}


// Build an array of objects using the settings node list
settings_NodeList.forEach((s) => {
	settings.push({
		node: s,
		id: s.id,
		current_state: 'idle',
		updateSetting: function(value){
			console.log('State: '+ this.current_state)
			switch(this.current_state){
				case 'idle':
					// TODO check value is valid
					console.log(value)
					if(value != 1){
						this.current_state = 'value-invalid'
						this.updateSetting()
						break;
					}

					ToggleErrorLabel(this.node)
					// TODO send value to micro
					ToggleCircleLoader(this.node)
					setTimeout(function(){ this.updateSetting() }.bind(this), 1000)
					this.current_state = 'updating'
					break

				case 'updating':
					ToggleCircleLoader(this.node)
					setTimeout(function(){ this.updateSetting() }.bind(this), 1)
					this.current_state = 'done'
					break

				case 'done':
					ToggleSuccessIcon(this.node)
					setTimeout(function(){ ToggleSuccessIcon(this.node )}.bind(this), 2000)
					this.current_state = 'idle'
					break

				case 'value-invalid':
					ToggleErrorLabel(this.node, "Value out of range")
					setTimeout(function(){ ToggleErrorLabel(this.node) }.bind(this), 5000)
					this.current_state = 'idle'
				default:
					current_state = 'idle'
			}
		}
	})
})

// Toggle the circle loader icon
function ToggleCircleLoader(node){
	node.querySelector('.setting-circle-loader').classList.toggle('hidden')
}

// Toggle the success icon
function ToggleSuccessIcon(node){
	node.querySelector('.setting-success-icon').classList.toggle('hidden')
}

// Toggle the error message
function ToggleErrorLabel(node, message){
	let el = node.querySelector('.setting-error-message')
	if(message){
		el.querySelector('span').innerText = message
		el.classList.remove('hidden')
	} else {
		el.classList.add('hidden')
	}
}
