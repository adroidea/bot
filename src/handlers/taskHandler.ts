import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

export type TaskFunction = () => void;

let nbTasks = 0;
let nbFailedTasks = 0;

export default async () => {
    const tasksFolders = [
        path.join(__dirname, '../tasks'),
        path.join(__dirname, '../modules/twitchlive/tasks'),
        path.join(__dirname, '../modules/qotd/tasks'),
        path.join(__dirname, '../modules/customEvents/tasks')
    ];

    const taskFiles: [string, string][] = [];

    tasksFolders.forEach((tasksFolder: string) => {
        if (fs.existsSync(tasksFolder)) {
            const files = fs.readdirSync(tasksFolder).filter(file => file.endsWith('.js'));
            taskFiles.push(...files.map(file => [tasksFolder, file] as [string, string]));
        }
    });

    taskFiles.forEach(([tasksFolder, file]: [string, string]) => {
        const taskModule: { default: TaskFunction } = require(path.join(tasksFolder, file));
        const taskFunction = taskModule.default;
        if (!taskFunction) {
            Logger.warn(`Not initialised Task.\nFile : ${file}`);
            return nbFailedTasks++;
        }
        nbTasks++;
        taskFunction();
    });

    if (nbFailedTasks !== 0) Logger.warn(`${nbFailedTasks} tasks not loaded.`);
    if (nbTasks !== 0) Logger.info(`${nbTasks} tasks loaded.`);
};
