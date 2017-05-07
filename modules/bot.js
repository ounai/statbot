'use strict';

var tgbot = require('node-telegram-bot-api');

var utilsModule = require('./utils');
var config = utilsModule.config, debug = utilsModule.debug;

var bot = new tgbot(config('bot-token'), { polling: true }), id;

bot.getMe().then(me => {
	id = me.id;
	debug('Bot working! @' + me.username + ' / ' + me.id);
});

module.exports.get = bot;

module.exports.id = callback => {
	if(id) callback(id);
	else bot.getMe().then(me => {
		id = me.id;
		callback(id);
	});
};
