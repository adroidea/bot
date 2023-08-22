import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

export type TaskFunction = () => void;

export const handleTask = (taskPath: string): number => {
    let result = 0;
    const files = fs.readdirSync(taskPath);
    for (const file of files) {
        const filePath = path.join(taskPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            result += handleTask(filePath);
        } else if (file.endsWith('.js')) {
            const taskModule: { default: TaskFunction } = require(filePath);
            const taskFunction = taskModule.default;
            if (!taskFunction) {
                Logger.warn(`File : ${file}`);
                Logger.warn(`Task function not found. Skipping...`);
            }
            taskFunction();
            result++;
        }
    }
    return result;
};
