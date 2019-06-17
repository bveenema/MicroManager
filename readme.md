## How to Build
### Development
- Clone repo
- npm install
- `./node_modules/.bin/electron-rebuild` - must be used with python 2 https://github.com/nodejs/node-gyp/issues/193#issuecomment-376602165

## CONFIG Format
### Background
During the handshake when connecting to a new device, the micro will send a CONFIG message to MicroManager which contains a JSON string of all settings, state and configuration options (baud, name, etc).

This CONFIG message controls MicroManager, so that MicroManager does not need to have any fore-knowledge of the settings and state on the micro-controller.

### Format
The config message is a JSON encoded string that contains baud, name, settings and state keys. All keys are optional.
#### Example Format
```json
{
	"baud": 9600,
	"name": "DeviceName",
	"settings": [
		{
			"n": "SettingName",
			"t": "SettingType",
			"c": 1, // command
			"l": 20, // low (min)
			"h": 30, // high (max)
			"d": 20, // default value
			"r": 22, // cuRrent value
			"f": 0, // float precision
			"i": "dB" // unIt
		},
		...
	],
	"state": [
		{
			"n": "StateName",
			"t": "StateType",
			"c": 7, // command
			"l": 0, // low (min)
			"h": 25, // high (max)
			"u": 250 // update Rate
		},
		...
	]
}
```

#### Abbreviation
To reduce memory overhead on the micro as well as size of the CONFIG message, the JSON keys in "settings" and "state" are abbreviated using the following list (contained in [setting-state-key.js](setting-state-key.js))

- `"n": "name"`
- `"t": "type"`
- `"c": "command"`
- `"l": "min"`
- `"h": "max"`
- `"d": "default"`
- `"u": "updateRate"`
- `"r": "current"`
- `"f": "floatPrecision"`
- `"i": "unit"`
- `"o": "options"`
- `"b": "buttonType"`