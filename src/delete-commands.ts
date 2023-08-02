import Logger from './utils/logger';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const cmds = [
    '1064894259767017502',
    '976035620772249659',
    '976058108143095828',
    '987684202721980480',
    '976035620772249655',
    '976035620772249658',
    '987684202721980479',
    '976035620772249657',
    '976035877761482793',
    '987684202721980478',
    '987684202721980477'
];
export const deleteCMD = (clientId: string) => {
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);
    for (const cmd of cmds) {
        rest.delete(Routes.applicationGuildCommand(clientId, '814621177770541076', cmd))
            .then(() => Logger.info(`Successfully deleted application command ${cmd}.`))
            .catch(console.error);
    }

    rest.put(Routes.applicationCommands(clientId), { body: [] })
        .then(() => Logger.info(`Successfully deleted all application commands.`))
        .catch(console.error);
};
