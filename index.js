const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const client = new Client({ intents: 128671 });
const Logger = require('./utils/Logger');

client.commands = new Collection();
['CommandUtil', 'EventUtil'].forEach(handler => {
    require(`./utils/handlers/${handler}`)(client);
});
require('./utils/Functions')(client);

process.on('exit', code => {
    Logger.client(`Process stoped with the code ${code}`);
});

/**
 * Throws an uncaught exception message without crashing the bot
 */
process.on('uncaughtException', (err, origin) => {
    Logger.error(`UNCAUGHT_EXCEPTION: ${err}`);
    console.error(`Origin : ${origin}`);
});

/**
 * Throws an unhandled rejection message without crashing the bot
 */
process.on('unhandledRejection', (reason, promise) => {
    Logger.warn(`UNHANDLED_REJECTION : ${reason}`);
    console.log(promise);
});

process.on('warning', (...args) => Logger.warn(...args));

// Database connection
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URI, {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    })
    .then(Logger.info('MongoDB connected'))
    .catch(err => {
        Logger.error(err);
    });

client.login(process.env.DISCORD_TOKEN);
