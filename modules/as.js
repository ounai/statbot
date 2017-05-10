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

var getMedals = module.exports.getMedals = (username, startdate, callback) => {
	if(username == config('agent-name')) {
		request({
			url: 'https://api.agent-stats.com/progress/' + startdate,
			headers: {
				'AS-Key': config('agent-stats-key')
			}
		}, (err, res, body) => {
			if(err) throw err;
			
			callback(JSON.parse(body));
		});
	} else {
		request({
			url: 'https://api.agent-stats.com/share/' + username + '/' + startdate,
			headers: {
				'AS-Key': config('agent-stats-key')
			}
		}, (err, res, body) => {
			if(err) throw err;
			
			var obj = JSON.parse(body);
			
			if(obj.error) {
				if(obj.error.indexOf('username not found') !== -1) {
					callback(username + ' isn\'t sharing their stats.\n'
						+ 'In order to do so, they\'ll need to add "'
						+ config('agent-name') + '" to their sharelist.');
				}
			} else callback(obj);
		});
	}
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

module.exports.getMedal = (medalName, username, startdate, callback) => {
	getMedals(username, startdate, stats => {
		if(typeof stats === 'string') callback(stats);
		else if(stats == undefined) callback();
		else for(var key in stats) {
			if(stats[key]['mymedals']) {
				if(stats[key]['mymedals'] == undefined || stats[key]['mymedals'][medalName] == undefined) {
					callback();
					return;
				}
				
				var result = [];
				
				for(var type of ['bronze', 'silver', 'gold', 'platinum', 'black'])
					if(stats[key]['mymedals'][medalName]['date'][type] !== 1)
						result.push(type + ' on ' + stats[key]['mymedals'][medalName]['date'][type]
							+ ' (' + stats[key]['mymedals'][medalName]['miss'][type] + ' '
							+ suffixes[medalName] + ' left)');
				
				callback(result);
			} else {
				if(stats[key] == undefined || stats[key][medalName] == undefined) {
					callback();
					return;
				}
				
				var result = [];
				
				for(var type of ['bronze', 'silver', 'gold', 'platinum', 'black'])
					if(stats[key][medalName]['date'][type] !== 1)
						result.push(type + ' on ' + stats[key][medalName]['date'][type]
							+ ' (' + stats[key][medalName]['miss'][type] + ' '
							+ suffixes[medalName] + ' left)');
				
				callback(result);
			}
		}
	});
};
