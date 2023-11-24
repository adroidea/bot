import { REST, Routes } from 'discord.js';
import Logger from './utils/logger';

/**
 * Deletes all global application commands.
 * @param clientId The ID of the Discord client.
 */
export const deleteCMD = async (clientId: string) => {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    rest.put(Routes.applicationCommands(clientId), { body: [] })
        .then(() => {
            Logger.info(`Successfully deleted all global application commands.`);
        })
        .catch(console.error);
};
