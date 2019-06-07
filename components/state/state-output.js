// Local Imports
const StateBase = require('./state-base')

class Output extends StateBase {
	constructor(settings) {
		super(settings)
		this.currentValue = this.settings.min
	}

	Update(value) {
		if(value){
			// Display the value container
			if(this.loaders[0].state === 'loading'){
				this.loaders[0].SetState('success')
				setTimeout(function(){
					this.node.querySelector('.spectrum-Label').classList.remove('invisible')
				}.bind(this), 1000)
			}

			// Only update the DOM if the value has changed
			if(this.currentValue !== value){
				// Update the DOM value
				let valContainer = this.node.querySelector('.spectrum-Label')
				valContainer.innerText = value

				// Update the Color
				if(value > this.settings.max || value < this.settings.min)
					this.SetColor('red')
				else
					this.SetColor('blue')
			}
		}
	}

	SetColor(color) {
		let el = this.node.querySelector('.spectrum-Label')
		if(color === 'red'){
			el.classList.remove('spectrum-Label--green', 'spectrum-Label--blue')
			el.classList.add('spectrum-Label--red')
		}else if(color === 'green'){
			el.classList.remove('spectrum-Label--red', 'spectrum-Label--blue')
			el.classList.add('spectrum-Label--green')
		}else if(color === 'blue'){
			el.classList.remove('spectrum-Label--red', 'spectrum-Label--green')
			el.classList.add('spectrum-Label--blue')
		}
	}
}

module.exports = Output;