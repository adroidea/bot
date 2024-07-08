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
    const files = fs.readdirSync(taskPath);
    let result = 0;

    for (const file of files) {
        const filePath = path.join(taskPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            result += await handleTask(filePath);
        } else if (file.endsWith('.js')) {
            result += await processFile(file, filePath);
        }
    }

    return result;
};

/**
 * Processes a single file based on its type.
 * @param file - The name of the file.
 * @param filePath - The full path to the file.
 * @returns A Promise that resolves to 1 if the file was handled, 0 otherwise.
 */
const processFile = async (file: string, filePath: string): Promise<number> => {
    try {
        const { default: taskFunction } = await import(filePath);

        switch (getFileType(file)) {
            case 'cron':
                return await handleCronTask(file, taskFunction);
            case 'worker':
            case 'queue':
                return 1;
            default:
                Logger.warn(`File: ${file}`);
                Logger.warn(`File type is not supported. Skipping...`);
                return 0;
        }
    } catch (error: any) {
        Logger.error(`Error importing task from file: ${file}`, error);
        return 0;
    }
};

/**
 * Determines the type of a file based on its name.
 * @param file - The name of the file.
 * @returns The type of the file ('cron', 'worker', 'queue', or 'unknown').
 */
const getFileType = (file: string): string => {
    if (file.endsWith('cron.js')) return 'cron';
    if (file.endsWith('worker.js')) return 'worker';
    if (file.endsWith('queue.js')) return 'queue';
    return 'unknown';
};

/**
 * Handles a cron task file.
 * @param file - The name of the file.
 * @param taskFunction - The task function to execute.
 * @returns A Promise that resolves to 1 if the task was executed, 0 otherwise.
 */
const handleCronTask = async (
    file: string,
    taskFunction: TaskFunction | undefined
): Promise<number> => {
    if (taskFunction) {
        taskFunction();
        return 1;
    } else {
        Logger.warn(`File: ${file}`);
        Logger.warn(`Task function not found. Skipping...`);
        return 0;
    }
};
