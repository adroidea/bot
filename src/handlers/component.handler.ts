import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * Handles the components in the specified path.
 * @param client - The client object.
 * @param compPath - The path to the components.
 * @returns A promise that resolves to a record containing the names of the subfolders and the number of subcomponents in each folder.
 */
export const handleComponents = async (
    client: any,
    compPath: string
): Promise<Record<string, number>> => {
    const result: Record<string, number> = {};

    const subFolders = fs.readdirSync(compPath);

    for (const subFolder of subFolders) {
        const stat = fs.lstatSync(path.join(compPath, subFolder));

        if (stat.isDirectory()) {
            result[subFolder] = await handleSubComponent(client, compPath, subFolder);
        }
    }

    return result;
};

/**
 * Handles sub-components recursively and adds valid components to the client.
 * @param client - The client object.
 * @param compPath - The path of the main component.
 * @param compFolder - The folder name of the main component.
 * @returns The number of valid components added to the client.
 */
const handleSubComponent = async (
    client: any,
    compPath: string,
    compFolder: string
): Promise<number> => {
    let result = 0;
    const subCompPath = path.join(compPath, compFolder);
    const files = fs.readdirSync(subCompPath);

    for (const file of files) {
        const filePath = path.join(subCompPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            result += await handleSubComponent(client, subCompPath, file);
        } else if (['Btn.js', 'Menu.js', 'Modal.js'].some(extension => file.endsWith(extension))) {
            const { default: component } = await import(filePath);

            const hasWarning = checkComponentOptions(component, filePath);
            if (!hasWarning) {
                client[compFolder].set(component.data.name, component);
                result += 1;
            }
        }
    }

    return result;
};

/**
 * Checks the options of a component.
 * @param component - The component to check.
 * @param filePath - The file path of the component.
 * @returns True if there are errors in the component options, false otherwise.
 */
const checkComponentOptions = (component: any, filePath: string): boolean => {
    let hasError = false;
    const errorList: string[] = [];
    if (!component.data.name) {
        errorList.push('NAME');
        hasError = true;
    }

    if (!('execute' in component)) {
        errorList.push('EXECUTE');
        hasError = true;
    }

    if (hasError) {
        Logger.warn(`File: ${filePath}`);
        Logger.warn(`${errorList.join(', ')} required. Skipping...`);
    }

    return hasError;
};
