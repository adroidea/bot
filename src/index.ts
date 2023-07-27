import { Collection, Partials } from 'discord.js';
import DiscordClient from './client';
import Logger from './utils/logger';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import { readdirSync } from 'fs';

dotenv.config();

export const client: any = new DiscordClient({
    intents: 3276799,
    partials: [Partials.Channel]
});

const filePath = path.join(__dirname, __filename);
client.commands = new Collection();

const handlersPath = path.join(__dirname, 'handlers');
const handlerFiles = readdirSync(handlersPath).filter(file => file.endsWith('Handler.js'));
handlerFiles.forEach((handlerFile: any) => {
    const filePath = path.join(handlersPath, handlerFile);
    import(filePath).then(handler => handler.default(client));
});

process.on('exit', (code: number) => {
    Logger.client(`Process stopped with the code ${code}`);
});

process.on('uncaughtException', (err: Error, origin: Error) => {
    Logger.error(`UNCAUGHT_EXCEPTION: ${err}`, origin, filePath);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    Logger.warn(`UNHANDLED_REJECTION : ${reason}`);
    console.log(promise);
});

client.rest.on('rateLimited', (info: any) => {
    Logger.warn(`A rate limit has been hit: ${JSON.stringify(info)}`);
});

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
        Logger.error("Couldn't connect to database", err, filePath);
    });

client.login(process.env.TOKEN);
