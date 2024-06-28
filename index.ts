import IORedis from 'ioredis';
import Logger from './src/utils/logger';
import client from './src/client';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';

let envPath = '.env.development';

if (process.env.NODE_ENV === 'PRODUCTION') {
    envPath = '.env.production';
}

dotenv.config({ path: envPath });

export const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: 6379,
    maxRetriesPerRequest: null
});

mongoose.set('strictQuery', false);
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

client.login(process.env.DISCORD_TOKEN);

const filePath = path.join(__dirname, 'src/handlers/module.handler.js');
import(filePath).then(handler => handler.default(client));

connection
    .on('connect', () => {
        Logger.info('🔴 Redis connected');
    })
    .on('error', (error: any) => {
        Logger.error(`Redis error:`, error);
    });

client.rest.on('rateLimited', (info: any) => {
    Logger.warn(`A rate limit has been hit: ${JSON.stringify(info)}`);
});

process.on('uncaughtException', (err: Error, origin: Error) => {
    Logger.error(`UNCAUGHT_EXCEPTION: ${err}`, origin);
});

process.on('exit', (code: number) => {
    Logger.client(`Process stopped with the code ${code}`);
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

process.on('beforeExit', (code: number) => {
    client.destroy();
    connection.disconnect();
    mongoose.disconnect();
    Logger.client(`Process stopped with the code ${code}`);
});

process.on('SIGINT', () => {
    client.destroy();
    connection.disconnect();
    mongoose.disconnect();
    Logger.client('Process interrupted by the user');
    process.exit(0);
});
