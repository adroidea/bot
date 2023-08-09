import { Client } from 'discord.js';
import Logger from '../utils/logger';
import path from 'path';
import { readdirSync } from 'fs';

export default async (client: Client) => {
    const eventPath = path.resolve(__dirname, '../modules/core/events');
    const eventFolders = readdirSync(eventPath);

    let nbEvents = 0;

    for (const folder of eventFolders) {
        const events = path.join(eventPath, folder);
        const eventFiles = readdirSync(events).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventPath, folder, file);
            const event = require(filePath);

            if (event.once) {
                client.once(event.name, (...args: any) => event.execute(client, ...args));
            } else {
                try {
                    client.on(event.name, async (...args: any) => event.execute(client, ...args));
                } catch (err) {
                    console.error(err);
                }
            }
            nbEvents++;
        }
    }

    if (nbEvents !== 0) Logger.info(`${nbEvents} events loaded.`);
};
