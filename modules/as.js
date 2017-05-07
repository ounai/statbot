'use strict';

var request = require('request');

var utilsModule = require('./utils');
var config = utilsModule.config, debug = utilsModule.debug;

var getStats = module.exports.getStats = (callback) => {
	request({
		url: 'https://api.agent-stats.com/groups/' + config('agent-stats-group-id'),
		headers: {
			'AS-Key': config('agent-stats-key')
		}
	}, (err, res, body) => {
		if(err) throw err;
		
		callback(JSON.parse(body));
	});
};

module.exports.getStat = (statName, callback) => {
	getStats((stats) => {
		var result = [];
		
		for(var agent in stats)
			if(stats[agent][statName] !== undefined)
				result.push([ agent, stats[agent][statName] ]);
		
		result.sort((a, b) => {
			return b[1] - a[1];
		});
		
		callback(result);
	});
};

