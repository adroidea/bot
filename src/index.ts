import { Collection, Partials } from 'discord.js';
import DiscordClient from './client';
import Logger from './utils/logger';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';

dotenv.config();

export const client: any = new DiscordClient({
    intents: 3276799,
    partials: [Partials.Channel]
});

client.commands = new Collection();

const filePath = path.join(__dirname, 'handlers/moduleHandler.js');
import(filePath).then(handler => handler.default(client));

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URI!, {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    })
    .then(() => Logger.info('🍃 MongoDB connected'))
    .catch((err: any) => {
        Logger.error("Couldn't connect to database", err);
    });

client.login(process.env.TOKEN);

client.rest.on('rateLimited', (info: any) => {
    Logger.warn(`A rate limit has been hit: ${JSON.stringify(info)}`);
});

process.on('exit', (code: number) => {
    Logger.client(`Process stopped with the code ${code}`);
});

process.on('uncaughtException', (err: Error, origin: Error) => {
    Logger.error(`UNCAUGHT_EXCEPTION: ${err}`, origin);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    Logger.warn(`UNHANDLED_REJECTION :`);
    if (reason instanceof Error) console.warn(reason.stack);
    else console.warn(reason);
    Logger.warn(`Promise :`);
    console.warn(promise);
});

process.on('warning', warning => {
    console.warn(`Un avertissement a été émis`, warning);
});
