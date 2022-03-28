const {Client, Collection} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const client = new Client({intents: 32767});

client.commands = new Collection();
['CommandUtil', 'EventUtil'].forEach(handler => {
    require(`./utils/handlers/${handler}`)(client);
});

process.on('exit', code => {
    console.log(`Process stoped with the code ${code}`);
});
process.on('uncaughtException', (err, origin) => {
    console.log(`UNCAUGHT_EXCEPTION: ${err}`, `Origin : ${origin}`);
});
process.on('unhandledRejection', (reason, promise) => {
    console.log(`UNHANDLED_REJECTION : ${reason}\n-----`, promise);
});
process.on('warning', (...args) => console.log(...args));

client.login(process.env.DISCORD_TOKEN);