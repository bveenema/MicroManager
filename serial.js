const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

// Local Imports
const MicroDebugWindow = require('./windows/micro-debug/micro-debug.js')


function open(portID){
  const port = new SerialPort('portID', {
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
}


module.exports = {
  GetDevices: function(){
    return new Promise((resolve, reject) => {
      SerialPort.list().then((ports) =>{
        resolve(ports)
        ports.forEach((port) => {
          console.log("----- Port -----\n", port)
        })
      }, (err) => {
        console.error(err)
      })
    })
  },
  
  Open: open,
}