import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

export const handleCommand = (client: any, cmdPath: string): number => {
    let result = 0;
    const files = fs.readdirSync(cmdPath);
    for (const file of files) {
        const filePath = path.join(cmdPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            result += handleCommand(client, filePath);
        } else if (file.endsWith('.js')) {
            const cmd = require(filePath);

            const hasWarning = checkCommandOptions(cmd, filePath);
            if (!hasWarning) {
                client.commands.set(cmd.data.name, cmd);
                result += 1;
            }
        }
    }
    return result;
};

const checkCommandOptions = (cmd: any, filePath: string): boolean => {
    let hasWarning = false;
    let hasError = false;
    const errorList: string[] = [];
    if (!cmd.data.name) {
        errorList.push('NAME');
        hasError = true;
    }

    if (!cmd.data.description) {
        errorList.push('DESCRIPTION');
        hasError = true;
    }

    if (!cmd.category) {
        errorList.push('CATEGORY');
        hasWarning = true;
    }

    if (!cmd.permissions) {
        errorList.push('PERMISSIONS');
        hasError = true;
    }

    if (!cmd.usage) {
        errorList.push('USAGE');
        hasWarning = true;
    }

    if (!cmd.examples) {
        errorList.push('EXAMPLES');
        hasWarning = true;
    }

    if (!('execute' in cmd)) {
        errorList.push('EXECUTE');
        hasError = true;
    }

    if (hasError) {
        Logger.warn(`File : ${filePath}`);
        Logger.warn(`${errorList.join(', ')} required. Skipping...`);
        return true;
    } else if (hasWarning) {
        Logger.warn(`File : ${filePath}`);
        Logger.warn(`${errorList.join(', ')} required.`);
    }

    return false;
};
