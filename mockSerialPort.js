const Devices = [
	{
		deviceInfo: { 
			comName: 'COM1',
			manufacturer: 'Particle',
			serialNumber: '2a0042000b47363433353735',
			pnpId: 'USB\\VID_2B04&PID_C006\\2A0042000B47363433353735',
			locationId: 'Port_#0003.Hub_#0002',
			vendorId: '2B04',
			productId: 'C006' 
		},
	},
	{
		deviceInfo: { 
			comName: 'COM2',
			manufacturer: 'Arduino',
			serialNumber: undefined,
			pnpId: 'ACPI\\PNP0501\\0',
			locationId: undefined,
			vendorId: undefined,
			productId: undefined 
		},
	},
	{
		deviceInfo: { 
			comName: 'COM3',
			manufacturer: 'Particle',
			serialNumber: '2a0042000b47363433353736',
			pnpId: 'USB\\VID_2B04&PID_C006\\2A0042000B47363433353736',
			locationId: 'Port_#0003.Hub_#0002',
			vendorId: '2B04',
			productId: 'C006' 
		},
	},
]

// Module Imports
const fs = require('fs')
const _ = require('lodash')

const events = require('events')
class SerialPort extends events.EventEmitter{
	constructor(comName){
		super()

		// save the device info
		this.deviceInfo = Devices.find((device) => {
			return comName === device.deviceInfo.comName
		}).deviceInfo

		this.path = comName

		// save the device config
		this.config = JSON.parse(fs.readFileSync('./mock-micro.json', 'utf8'))

		// Create the open event
		setTimeout(function(){ 
			this.emit('open') 
		}.bind(this), 50)

		// Send the READY message
		this.ready = false
		setTimeout(function(){
			this.emit('data', "READY")
		}.bind(this), 200)

		// Drip debug messages
		this.dataDripCount = 0
		this.dataDripInterval = setInterval(function(){
			this.emit('data', '0:'+this.deviceInfo.comName + ': ' + this.dataDripCount++)
		}.bind(this), 1000)
	}

	static list() {
		return new Promise((resolve, reject) => {
			let deviceList = Devices.map((d) =>{
				return d.deviceInfo
			})
			resolve(deviceList)
		})
	}

	write(data) {
		if(data === 'CONFIG'){
			console.log('Sending Config')
			let config = JSON.stringify(this.config)
			setTimeout(function(){ this.emit('data', 'CONFIG:'+config) }.bind(this), 50)
		}else{
			setTimeout(function(){
				// Get the command and value
				const [keyWord, value] = data.split(/:(.+)/)

				// Get the type
				let type = ''
				this.config.state.forEach((s) => {
					if(s.c == keyWord)
						type = s.t // t == type
				})
				if(value !== 'undefined'){
					this.emit('data', data)
					if(type === 'toggle') setTimeout(function(){ this.emit('data', keyWord + ':e') }.bind(this), 500) // re-enable the toggle
				}
				else{
					this.emit('data', keyWord + ':' + this.GetState(parseInt(keyWord), value))
				}
			}.bind(this), 10)
		}
	}

	// Get the mocked current value of the state
	GetState(command, value){
		let returnVal = null
		this.config.state.forEach((s) => {
			if(s.c === command){
				if(s.t === 'output'){
					// initialize the current value
					if(typeof s.currentValue === 'undefined')
						s.currentValue = s.l

					// Initialize the increment
					if(typeof s.increment === 'undefined')
						s.increment = _.round((s.h - s.l)/25)

					// Increment the current value
					s.currentValue += s.increment
					returnVal = s.currentValue

					// Invert the increment when out of bounds
					if(s.currentValue > (s.h + Math.abs(3*s.increment))
					|| s.currentValue < (s.l - Math.abs(3*s.increment)))
						s.increment = -s.increment
				}
				else if(s.t === 'button'){
					// initialize the current value
					if(typeof s.currentValue === 'undefined')
						s.currentValue = false

					// invert the button state
					s.currentValue = !s.currentValue
					returnVal = s.currentValue
				}
				else if(s.t === 'toggle'){
					// initialize the current value and enable
					if(typeof s.enabled === 'undefined')
						s.enabled = 'd'

					// inver the enable state
					s.enabled = (s.enabled === 'e') ? 'd':'e'
					returnVal = s.enabled
				}
				else if(s.t === 'process'){
					// initialize the current value
					if(typeof s.currentValue === 'undefined')
						s.currentValue = 0

					// Increment the current value, rest to 0 if > 100
					let increment = (s.u > 2000) ? 20 : 1
					s.currentValue += increment
					if(s.currentValue > 100) s.currentValue = 0
					returnVal = s.currentValue
				}
				
			}
		})
		return returnVal
	}

	update(){}

	// Mock the pipe function. Returns the object so that parser events can be registered on the instance
	pipe(){
		return this
	}

	// Close - Clean up the instance before GC
	// Disables the data drip
	close(callback){
		clearInterval(this.dataDripInterval)
		callback()
	}
}


module.exports = SerialPort