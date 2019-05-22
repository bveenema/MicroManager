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

const events = require('events')
class SerialPort extends events.EventEmitter{
	constructor(comName){
		super()
		this.deviceInfo = Devices.find((device) => {
			return comName === device.deviceInfo.comName
		})
		setTimeout(function(){ 
			console.log('Emitting OPEN event')
			this.emit('open') 
		}.bind(this), 5)
	}

	static list() {
		return new Promise((resolve, reject) => {
			let deviceList = Devices.map((d) =>{
				return d.deviceInfo
			})
			resolve(deviceList)
		})
	}
}


module.exports = SerialPort