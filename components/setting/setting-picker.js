// Module Imports
const fs = require('fs')
const Mustache = require('mustache')

// Local Imports
const SettingBase = require('./setting-base.js')
const Loader = require('../loader/loader.js')

class SettingPicker extends SettingBase {
	constructor(settingObj, node_id) {
		super(settingObj, node_id)
		this.selections = settingObj.options
		this.currentState = 'closed'
		this.loaders = []
	}

	CreateDOMNode() {
		return super.CreateDOMNode('setting-picker.mst', {
			title: this.name,
			options: this.options
		})
	}
}

module.exports = SettingPicker