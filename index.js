const Discord = require('discord.js');

const client = new Discord.Client({intents :[]});

const config = require('./config.json');

const eventHandler = require('./handlers/eventHandler');


client.login(config.token);


eventHandler(client);
