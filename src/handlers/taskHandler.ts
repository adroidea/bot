import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

export type TaskFunction = () => void;

let nbTasks = 0;
let nbFailedTasks = 0;

export default async () => {
    // Get the list of task files in the tasks folder
    const tasksFolder = path.join(__dirname, '../tasks');
    const taskFiles = fs.readdirSync(tasksFolder).filter(file => file.endsWith('.js'));

    taskFiles.forEach((file: string) => {
        // Dynamically import the task module
        const taskModule: { default: TaskFunction } = require(path.join(tasksFolder, file));

        // Find the exported function and call it to schedule the task
        const taskFunction = taskModule.default;
        if (!taskFunction) return nbFailedTasks++;
        nbTasks++;
        taskFunction();
    });

    if (nbFailedTasks !== 0) Logger.warn(`${nbFailedTasks} tasks not loaded.`);
    if (nbTasks !== 0) Logger.info(`${nbTasks} tasks loaded.`);
};
