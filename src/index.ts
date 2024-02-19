import DiscordClient from './client';
import IORedis from 'ioredis';
import L from './locales/i18n-node';
import Logger from './utils/logger';
import { Partials } from 'discord.js';
import dotenv from 'dotenv';
import { loadAllLocales } from './locales/i18n-util.sync';
import mongoose from 'mongoose';
import path from 'node:path';

let envPath = '.env.development';

if (process.env.NODE_ENV === 'PRODUCTION') {
    envPath = '.env.production';
}

dotenv.config({ path: envPath });

loadAllLocales();

console.log(L.en.errors.botPermissions());
export const client: any = new DiscordClient({
    intents: 3276799,
    partials: [Partials.Channel]
});

const filePath = path.join(__dirname, 'handlers/module.handler.js');
import(filePath).then(handler => handler.default(client));

mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URI!, {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        dbName: 'adroidDB'
    })
    .then(() => Logger.info('🍃 MongoDB connected'))
    .catch((err: any) => {
        Logger.error("Couldn't connect to database", err);
    });

export const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: 6379
})
    .on('connect', () => {
        Logger.info('🔴 Redis connected');
    })
    .on('error', (error: any) => {
        if (error.code === 'ECONNREFUSED') return;
        else Logger.error(`Redis error:`, error);
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
    if (warning.message.includes('The Fetch API is an experimental feature')) {
        return;
    }
    console.warn(`Un avertissement a été émis`, warning);
});
