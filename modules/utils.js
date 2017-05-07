'use strict';

var config;

// Load config.json
try {
	config = require('../config.json');
} catch(err) {
	console.log('Error reading config file!\n');
	throw err;
}

module.exports.config = key => {
	return config[key];
};

var debug = module.exports.debug = msg => {
	if(config['debug-mode']) {
		if(typeof msg === 'object') msg = JSON.stringify(msg);
		console.log('[DEBUG] ' + msg);
	}
};

