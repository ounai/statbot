'use strict';

var utilsModule = require('./modules/utils');
var config = utilsModule.config, debug = utilsModule.debug;

var botModule = require('./modules/bot');
var bot = botModule.get, botId = botModule.id;

var as = require('./modules/as');

// /ap
bot.onText(/\/ap/, (msg, match) => {
	as.getStat('ap', arr => {
		var stats = '';
		
		arr.forEach(e => {
			stats += e[0] + ': ' + e[1] + ' AP\n';
		});
		
		bot.sendMessage(msg.chat.id, stats);
	});
});

// /stat
bot.onText(/\/stat .+/, (msg, match) => {
	var stat = msg.text.split(' ')[1].toLowerCase();
	
	as.getStat(stat, arr => {
		var empty = true;
		var stats = '*' + stat[0].toUpperCase() + stat.substring(1) + ':*\n';
		
		arr.forEach(e => {
			stats += e[0] + ': ' + e[1] + ' AP\n';
			empty = false;
		});
		
		if(empty) bot.sendMessage(msg.chat.id, 'No such stat!');
		else bot.sendMessage(msg.chat.id, stats, { parse_mode: 'Markdown' });
	});
});

bot.on('message', msg => {
	const chatId = msg.chat.id;
	const firstName = msg.from.first_name;
	const lastName = msg.from.last_name;
	const username = msg.from.username || msg.from.first_name;
	const text = msg.text;
	
	if(msg.new_chat_member) {
		// Someone has been added to the group
		// Check if it is me and react appropriately
		
		botId(id => {
			if(msg.new_chat_member.id === id) {
				console.log('I have been added to group ' + msg.chat.id);
				
				if(config('telegram-group-id')[0] === '#' || config('telegram-group-id').length === 0) {
					bot.sendMessage(chatId, 'Group id:').then(() => {
						bot.sendMessage(chatId, chatId);
						bot.leaveChat(chatId);
					});
				} else if(config('telegram-group-id') != chatId) {
					console.log('Group "' + msg.chat.id + '" is not "' + config('telegram-group-id') + '", leaving...');
					bot.leaveChat(chatId);
				}
			}
		});
		
		return;
	}
	
	// Discard any other non-text messages
	if(text === undefined) {
		debug('Unhandled message:');
		debug(msg);
		
		return;
	}
	
	// Discard commands
	if(text[0] === '/') return;
	
	if(msg.chat.type === 'private') {
		// Private message to the bot
		
		console.log(firstName + ' ' + lastName + (username !== firstName ? ' (@' + username + '): ' : ': ') + text);
	} else {
		// Message in a group
		
		const groupName = msg.chat.title
		console.log('[' + groupName + '] ' + firstName + ' ' + lastName + (username !== firstName ? ' (@' + username + '): ' : ': ') + text);
	}
});
