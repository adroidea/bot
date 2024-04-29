import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * Handles commands recursively in the specified directory path.
 * @param client - The client object.
 * @param cmdPath - The path to the directory containing the commands.
 * @returns A promise that resolves to the number of commands handled.
 */
export const handleCommand = async (client: any, cmdPath: string): Promise<number> => {
    let result = 0;
    const files = fs.readdirSync(cmdPath);

    for (const file of files) {
        const filePath = path.join(cmdPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            result += await handleCommand(client, filePath);
        } else if (file.endsWith('.js')) {
            const { default: cmd } = await import(filePath);

            const hasWarning = checkCommandOptions(cmd, filePath);
            if (!hasWarning) {
                client.commands.set(cmd.data.name, cmd);
                result += 1;
            }
        }
    }
    return result;
};

/**
 * Checks the command options for validity.
 * @param cmd - The command object to check.
 * @param filePath - The file path of the command handler.
 * @returns Returns true if there are errors, false otherwise.
 */
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

    //if (!cmd.module) {
    //    errorList.push('MODULE');
    //    hasWarning = true;
    //}

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
