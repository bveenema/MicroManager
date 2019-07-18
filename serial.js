// Module Imports
const { ipcMain } = require('electron')
const RealSerialPort = require('serialport')
const MockSerialPort = require('./mockSerialPort')
let SerialPort = RealSerialPort
const Readline = require('@serialport/parser-readline')

// Local Imports
const MicroDebugWindow = require('./windows/micro-debug/micro-debug')
const MainWindow = require('./windows/main/main')
const Key = require('./settings-state-key')

let port = null
const WRITE_INTERVAL = 10 //ms
let WriteBuffer = {
  LastCommand: '',
  Writeable: true,
  Writes: [],
  OutstandingCommand: null,
  OutsandingCallback: null,
  WriteTimer: null,

  // Write
  // Attempts to write the next command to the device.
  // Writes are only allowed every WRITE_INTERVAL after a write is acknowledged by the device
  Write: function(){
    // If Writeable, write the object and set not Writeable
    if(this.Writeable){
      this.Writeable = false
      // write to the serial port
      let wObj = this.Writes.shift()
      port.write(wObj.command + ':' + wObj.value)

      // Set the outstanding values
      this.OutstandingCommand = wObj.command
      this.OutsandingCallback = wObj.callback
    }

    // Call again if there are still Writes in the buffer
    if(this.Writes.length > 0 && this.WriteTimer === null){
      this.WriteTimer = setTimeout(function(){ 
        this.WriteTimer = null
        this.Write()
      }.bind(this), 2)
    }
  },

  // Handle Acknowledge
  Acknowledge: function(returnVal) {
    // Reset Oustanding Command and call the callback
    this.OutstandingCommand = null
    this.OutsandingCallback(returnVal)

    // Delay next write for WRITE_INTERVAL
    setTimeout(function(){ this.Writeable = true }.bind(this), WRITE_INTERVAL)
  },
}


// Handle Write
ipcMain.on('serial:write', (e, command, value) => {
  // Add to the write buffer
  WriteBuffer.Writes.push({
    command: command, 
    value: value,
    callback: function(returnVal){
      e.reply('serial:wrote', command, returnVal)
    }
  })
  WriteBuffer.Write()
})


// Open
// Attempts to open the specified port. Returns resolve if successful
// \param[obj] device - device object (generated by)
function Open(device){
  return new Promise((resolve, reject) => {
    // Close any open port
    if(port){
      console.log('closing the open port')
      port.close((err) => {
        if(err) reject()

        // reset ready and configured
        ready = false
        configured = false

        OpenPort(device).then(() => {
          console.log('closed')
          resolve()
        }).catch(() => {
          console.log('failed to close')
          reject()
        })
      })
    }else{
      OpenPort(device).then(() => {
        resolve()
      }).catch(() => {
        console.log('Catching OpenPort reject')
        reject()
      })
    }
  })
}

function HandleConfig(configObj) {
  // Update the Baud Rate
  if(configObj.baud)
    port.update({
      baudRate: configObj.baud
    })

  // Add Name
  if(configObj.name)
    MainWindow.LoadName(configObj.name)

  // Load settings
  if(configObj.settings)
    MainWindow.LoadSettings(configObj.settings)

  // Load state
  if(configObj.state)
    MainWindow.LoadState(configObj.state)
}

function OpenPort(device){
  return new Promise((resolve, reject) => {
    // Open the port
    port = new SerialPort(device.comName, {
      // no options
    })
    console.log("PORT:\n", port)

    // Attach a newline parser
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

    // Handle Incoming Data
    parser.on('data', (data) => {
      // split the data string at the first colon, into keyWord and value
      let keyWord, value
      let i = data.indexOf(':')
      if(i >= 0)
        [keyWord, value] = [data.slice(0,i), data.slice(i+1)]
      else
        keyWord = data.trim();
      let command = parseInt(keyWord)
      // Handle 'READY' keyword
      if(keyWord == 'READY'){
        port.write('CONFIG\n')
        clearInterval(port.SendConnectInterval)
      // Handle 'CONFIG' return
      }else if(keyWord === 'CONFIG'){
        console.log(value);
        // update settings and state with key
        Key.forEach((pair) => {
          let [k, v] = pair
          value = value.replace(new RegExp("\""+k+"\"",'g'), "\""+v+"\"")
        })

        // Convert JSON to object
        let config = JSON.parse(value)
        HandleConfig(config)
        resolve()
      
      // Handle debug messages
      }else if(command === 0){
        console.log('Debug Log:', value);
        MicroDebugWindow.Update(value)
      
      // Handle command messages
      }else if(command !== NaN){
        // Handle write acknowledges
        if(command === WriteBuffer.OutstandingCommand)
          WriteBuffer.Acknowledge(value)
        else
          MainWindow.Update(command, value)
      }
      
    })

    // Handle open
    port.on('open', () => {
      console.log('Open')
      port.SendConnectInterval = setInterval( function(){
        console.log('Sending MICROMANAGER')
        port.write('MICROMANAGER\n') 
      }, 100 )
    })

    // Handle error
    port.on('error', () => {
      console.log('Error')
      reject()
    })
  })
}

// Handle serial open
ipcMain.on('serial:open', (e, device) => {
  Open(device).then(() => {
    e.reply('serial:opened', true)
  }).catch(() => {
    console.log('Failed to Open')
  })
})

module.exports = {
  GetDevices: function(){
    return new Promise((resolve, reject) => {
      SerialPort.list().then((ports) =>{
        resolve(ports)
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
  },

  Path: function(){
    return (port) ? port.path : undefined
  }
}