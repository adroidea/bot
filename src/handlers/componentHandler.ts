import Logger from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

export default async (client: any) => {
    const categoryFolders = [
        // Ppath.join(__dirname, '../twitchlive/components'),
        path.join(__dirname, '../modules/qotd/components'),
        path.join(__dirname, '../modules/tempVoice/components'),
        path.join(__dirname, '../modules/customEvents/components')
    ];

    const componentFolders = ['buttons', 'modals', 'selectMenus'];
    const counts: Record<string, Record<string, number>> = {};

    for (const category of categoryFolders) {
        try {
            const stats = await fs.stat(category);
            if (!stats.isDirectory()) {
                Logger.warn(`"${category}" is not a directory.`);
                continue;
            }
        } catch (error: any) {
            Logger.warn(`Error checking "${category}": ${error.message}`);
            continue;
        }

        counts[category] = {};

        for (const folder of componentFolders) {
            const folderPath = path.join(category, folder);
            try {
                const stats = await fs.stat(folderPath);
                if (!stats.isDirectory()) continue;
            } catch (error: any) {
                continue;
            }

            const componentFiles = (await fs.readdir(folderPath)).filter(file =>
                file.endsWith('.js')
            );
            counts[category][folder] = 0;

            for (const file of componentFiles) {
                try {
                    const filePath = path.join(folderPath, file);
                    const component = require(filePath);
                    client[folder].set(component.data.name, component);
                    counts[category][folder]++;
                } catch (error: any) {
                    Logger.warn(
                        `Error loading ${path.basename(
                            category
                        )}/${folder} component from file ${file}: ${error.message}`
                    );
                }
            }
        }
    }

    for (const category of categoryFolders) {
        let categoryMsg = `${category.split(path.sep).slice(-2, -1)[0]} :`;

        const componentCounts: string[] = [];
        for (const folder of componentFolders) {
            const count = counts[category][folder];
            if (count ?? 0) componentCounts.push(`${count} ${folder}`);
        }

        categoryMsg += ` ${componentCounts.join(' | ')} were loaded.`;
        Logger.info(categoryMsg);
    }
};
