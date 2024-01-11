import Logger from '../utils/logger';
import { Modules } from '../utils/consts';
import fs from 'fs';
import { handleCommand } from './commandHandler';
import { handleComponents } from './componentHandler';
import { handleEvent } from './eventHandler';
import { handleTask } from './taskHandler';
import path from 'path';

export default async (client: any) => {
    const moduleFolders = Object.values(Modules).map(module => {
        const modulePath = path.join(__dirname, `../modules/${module.name}`);
        return modulePath;
    });

    const counts: Record<string, Record<string, any>> = {};

    for (const module of moduleFolders) {
        const moduleContent = fs.readdirSync(module);

        const moduleName = path.basename(module);
        counts[moduleName] = {};
        for (const folder of moduleContent) {
            counts[moduleName][folder] = 0;
            const folderPath = path.join(module, folder);
            switch (folder) {
                case 'commands':
                    counts[moduleName][folder] += await handleCommand(client, folderPath);
                    break;
                case 'components':
                    counts[moduleName][folder] = await handleComponents(client, folderPath);
                    break;
                case 'events':
                    counts[moduleName][folder] += await handleEvent(client, folderPath);
                    break;
                case 'tasks':
                    counts[moduleName][folder] += await handleTask(folderPath);
                    break;
                case 'models':
                case 'services':
                case 'utils':
                    break;
                default:
                    Logger.warn(`Folder : ${folderPath}`);
                    Logger.warn(`"${folder}" is not a valid folder in ${module}. Skipping...`);
                    break;
            }
        }
    }
    formatCounts(counts);
};

/**
 * Formats the counts in the given record and logs the formatted output.
 * @param record - The record containing the counts to be formatted.
 */
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
