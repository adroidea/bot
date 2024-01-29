import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

export type TaskFunction = () => void;

/**
 * Handles tasks in the specified directory recursively.
 * @param taskPath - The path to the directory containing the tasks.
 * @returns A Promise that resolves to the number of tasks handled.
 */
export const handleTask = async (taskPath: string): Promise<number> => {
    let result = 0;
    const files = fs.readdirSync(taskPath);

    for (const file of files) {
        const filePath = path.join(taskPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            result += await handleTask(filePath);
        } else if (file.endsWith('.js')) {
            try {
                const { default: taskFunction } = await import(filePath);

                if (taskFunction) {
                    await taskFunction();
                    result++;
                } else {
                    Logger.warn(`File: ${file}`);
                    Logger.warn(`Task function not found. Skipping...`);
                }
            } catch (error: any) {
                Logger.error(`Error importing task from file: ${file}`, error);
            }
        }
    }

    return result;
};
