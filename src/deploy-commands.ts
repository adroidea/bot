import { REST, Routes } from 'discord.js';
import { Guilds } from './utils/consts';
import Logger from './utils/logger';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'node:path';

dotenv.config();
export const regCMD = async (clientId: string) => {
    const commands: any[] = [];
    const guildCommands: any[] = [];

    const categoryFolders = [
        path.join(__dirname, 'modules/core/commands'),
        path.join(__dirname, 'modules/qotd/commands'),
        path.join(__dirname, 'modules/setup/commands'),
        //path.join(__dirname, 'modules/scheduledEvents/commands'),
        path.join(__dirname, 'modules/tempVoice/commands')
        //path.join(__dirname, 'modules/twitchLive/commands'),
    ];

    const readCommands = async (dir: string) => {
        try {
            const files = fs.readdirSync(dir);

            const promises = files.map(async file => {
                const filePath = path.join(dir, file);
                const stat = fs.lstatSync(filePath);

                if (stat.isDirectory()) {
                    return readCommands(filePath);
                } else if (file.endsWith('.js')) {
                    const { default: command } = await import(filePath);
                    command.data.dmPermission = false;
                    if (command.guildOnly) guildCommands.push(command.data);
                    else commands.push(command.data);
                }
            });

            await Promise.all(promises);
        } catch (error: any) {
            Logger.error('Error while reading commands', error);
        }
    };

    await Promise.all(categoryFolders.map(readCommands));

    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, Guilds.adan_ea), {
            body: guildCommands
        });
        Logger.info(`Successfully registered ${guildCommands.length} guild application commands.`);

        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        Logger.info(`Successfully registered ${commands.length} application commands.`);
    } catch (error: any) {
        Logger.error('Error while registering application commands', error);
    }
};
