'use strict';

var request = require('request');

var utilsModule = require('./utils');
var config = utilsModule.config, debug = utilsModule.debug;

var suffixes = {
	ap: 'AP',
	explorer: 'portals',
	seer: 'portals',
	trekker: 'km',
	builder: 'resonators',
	connector: 'links',
	'mind-controller': 'fields',
	illuminator: 'MU',
	recharger: 'XM',
	liberator: 'portals',
	pioneer: 'portals',
	engineer: 'mods',
	purifier: 'resonators',
	guardian: 'days',
	specops: 'missions',
	missionday: 'mission days',
	hacker: 'hacks',
	translator: 'glyph points',
	sojourner: 'days',
	recruiter: 'agents',
	magnusbuilder: 'resonators'
};

var getStats = module.exports.getStats = (type, callback) => {
	request({
		url: 'https://api.agent-stats.com/groups/' + config('agent-stats-group-id') + '/' + type,
		headers: {
			'AS-Key': config('agent-stats-key')
		}
	}, (err, res, body) => {
		if(err) throw err;
		
		callback(JSON.parse(body));
	});
};

module.exports.getStat = (statName, type, callback) => {
	getStats(type, stats => {
		var result = [];
		
		for(var agent in stats)
			if(stats[agent][statName] !== undefined)
				result.push([ agent, stats[agent][statName] ]);
		
		result.sort((a, b) => {
			return b[1] - a[1];
		});
		
		for(var i = 0; i < result.length; i++)
			result[i][1] = result[i][1].toLocaleString() + ' ' + suffixes[statName];
		
		callback(result);
	});
};

