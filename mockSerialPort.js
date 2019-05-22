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
		config: {
			baud: 9600,
			settings: [
				{
					name: "Volume",
					type: "slider",
					command: 4,
					min: 20,
					max: 30,
					default: 20,
					float: false,
					unit: "dB"
				},
				{
					name: "Volume",
					type: "slider",
					command: 4,
					min: 0,
					max: 10,
					default: 1,
					float: true,
					floatPrecision: 2,
					unit: "dB"
				},
				{
					name: "Motor Seed",
					type: "input",
					command: 0,
					min: 0,
					max: 10,
					default: 1,
					float: false,
					unit: "RPM"
				},
				{
					name: "Target Pressure",
					type: "input",
					command: 1,
					min: 10,
					max: 500,
					default: 11,
					float: false,
					unit: "PSI"
				},
				{
					name: "Direction",
					type: "picker",
					command: 2,
					default: "Left",
					options: [
						"Left",
						"Right",
						"Up",
						"Down"
					]
				},
				{
					name: "Direction",
					type: "picker",
					command: 3,
					default: "Left",
					options: [
						"Left",
						"Right",
						"Up",
						"Down"
					]
				}
			] 
		}
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

const events = require('events')
class SerialPort extends events.EventEmitter{
	constructor(comName){
		super()

		// save the device info
		this.deviceInfo = Devices.find((device) => {
			return comName === device.deviceInfo.comName
		}).deviceInfo

		// save the device config
		this.config = Devices.find((device) => {
			return comName === device.deviceInfo.comName
		}).config

		// Create the open event
		setTimeout(function(){ 
			this.emit('open') 
		}.bind(this), 50)

		// Send the READY message
		this.ready = false
		setTimeout(function(){
			this.emit('data', "READY")
		}.bind(this), 200)

		// Drip data
		this.dataDripCount = 0
		this.dataDripInterval = setInterval(function(){
			this.emit('data', this.deviceInfo.comName + ': ' + this.dataDripCount++)
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
			setTimeout(function(){ this.emit('data', config) }.bind(this), 50)
		}else{
			setTimeout(function(){ this.emit('data', data) }.bind(this), 10)
		}
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