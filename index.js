const {Client, Collection} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const client = new Client({intents: 32767});

['commands', 'buttons'].forEach(x => client[x] = new Collection());
['CommandUtil', 'EventUtil', 'ButtonUtil'].forEach(handler => {
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

mongoose.connect(process.env.DATABASE_URI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    family: 4
}).then(() => console.log('Successfully connected to the database'))
    .catch(error => console.log('Error while connecting to the database : ', error));

client.login(process.env.DISCORD_TOKEN);
