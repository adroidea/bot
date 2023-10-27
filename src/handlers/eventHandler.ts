import { Client } from 'discord.js';
import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

export const handleEvent = async (client: Client, eventPath: string): Promise<number> => {
    let result = 0;
    const files = fs.readdirSync(eventPath);

    for (const file of files) {
        const filePath = path.join(eventPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            result += await handleEvent(client, filePath);
        } else if (file.endsWith('.js')) {
            const { default: event } = await import(filePath);

            if (event.once) {
                client.once(event.name, (...args: any) => event.execute(client, ...args));
            } else {
                try {
                    client.on(event.name, async (...args: any) => event.execute(client, ...args));
                } catch (err: any) {
                    Logger.error('Error importing this event', err, filePath);
                }
            }
            result++;
        }
    }

    return result;
};
