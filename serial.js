const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

// Local Imports
const MicroDebugWindow = require('./windows/micro-debug/micro-debug.js')

SerialPort.list().then(
  ports => ports.forEach((port) => {
    console.log("----- Port -----\n", port)
  }),
  err => console.error(err)
)

const port = new SerialPort('COM4', {
  baudRate: 9600,
})

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

port.on('open', () => {
    console.log('Open')
})

parser.on('data', (data) => {
    console.log(data)
    MicroDebugWindow.Update(data)
})