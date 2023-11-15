import Logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

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
