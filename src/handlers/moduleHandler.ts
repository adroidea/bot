import Logger from '../utils/logger';
import fs from 'fs';
import { handleCommand } from './commandHandler';
import { handleComponents } from './componentHandler';
import { handleEvent } from './eventHandler';
import { handleTask } from './taskHandler';
import path from 'path';

export default (client: any) => {
    const moduleFolders = [
        path.join(__dirname, '../modules/core'),
        path.join(__dirname, '../modules/scheduledEvents'),
        path.join(__dirname, '../modules/qotd'),
        path.join(__dirname, '../modules/tempVoice'),
        path.join(__dirname, '../modules/twitchLive')
    ];

    const counts: Record<string, Record<string, any>> = {};

    for (const module of moduleFolders) {
        //read the content of the folder
        const moduleContent = fs.readdirSync(module);

        const moduleName = path.basename(module);
        counts[moduleName] = {};
        for (const folder of moduleContent) {
            counts[moduleName][folder] = 0;
            const folderPath = path.join(module, folder);
            switch (folder) {
                case 'commands':
                    counts[moduleName][folder] += handleCommand(client, folderPath);
                    break;
                case 'components':
                    counts[moduleName][folder] = handleComponents(client, folderPath);
                    break;
                case 'events':
                    counts[moduleName][folder] += handleEvent(client, folderPath);
                    break;
                case 'tasks':
                    counts[moduleName][folder] += handleTask(folderPath);
                    break;
                case 'models':
                case 'services':
                case 'utils':
                    break;
                default:
                    Logger.warn(`"Folder : ${folderPath}`);
                    Logger.warn(`"${folder}" is not a valid folder in ${module}. Skipping...`);
                    break;
            }
        }
    }
    formatCounts(counts);
};

function formatCounts(record: Record<string, Record<string, any>>) {
    for (const [key, innerRecord] of Object.entries(record)) {
        const formattedInnerRecord: string[] = [];

        for (const [innerKey, value] of Object.entries(innerRecord)) {
            if (typeof value === 'object') {
                formattedInnerRecord.push(
                    `${innerKey}: ${Object.entries(value)
                        .map(([innerInnerKey, innerValue]) => `${innerInnerKey}: ${innerValue}`)
                        .join(', ')}`
                );
            } else {
                if (value === 0) continue;
                formattedInnerRecord.push(`${innerKey}: ${value}`);
            }
        }

        Logger.info(`${key}: ${formattedInnerRecord.join(' | ')}`);
    }
}
