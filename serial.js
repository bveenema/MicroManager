// Module Imports
const { ipcMain } = require('electron')
const RealSerialPort = require('serialport')
const MockSerialPort = require('./mockSerialPort')
let SerialPort = RealSerialPort
const Readline = require('@serialport/parser-readline')

// Local Imports
const MicroDebugWindow = require('./windows/micro-debug/micro-debug')

let port

// Open
// Attempts to open the specified port. Returns resolve if successful
// \param[obj] device - device object (generated by)
function Open(device){
  return new Promise((resolve, reject) => {
    console.log("Tring to open: ", device.comName)

    // Close any open port
    if(port){
      console.log('closing the open port')
      port.close((err) => {
        if(err) reject()
        OpenPort(device).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    }else{
      OpenPort(device).then(() => {
        resolve()
      }).catch(() => {
        reject()
      })
    }

  })
}

function OpenPort(device){
  return new Promise((resolve, reject) => {
    // Open the port
    port = new SerialPort(device.comName, {
      
    })

    // Attach a newline parser
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

    // Handle Incoming Data
    parser.on('data', (data) => {
      MicroDebugWindow.Update(data)
    })

    // Handle open
    port.on('open', () => {
        console.log('Open')
        resolve()
    })
  })
}

// Handle serial open
ipcMain.on('serial:open', (e, device) => {
  Open(device).then(() => {
    e.reply('serial:opened', true)
  })
})


module.exports = {
  GetDevices: function(){
    return new Promise((resolve, reject) => {
      SerialPort.list().then((ports) =>{
        console.log(ports)
        resolve(ports)
        ports.forEach((port) => {
          console.log("----- Port -----\n", port)
        })
      }, (err) => {
        console.error(err)
      })
    })
  },

  UpdateMockSerial: function(){
    if(process.useMockMicros)
      SerialPort = MockSerialPort
    else
      SerialPort = RealSerialPort
  }
}