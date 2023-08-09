import { REST, Routes } from 'discord.js';
import Logger from './utils/logger';
import { OWNER_SERVER_ID } from './utils/consts';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'node:path';

dotenv.config();
export const regCMD = (clientId: string) => {
    const commands: any[] = [];
    const guildCommands: any[] = [];

    const categoryFolders = [
        path.join(__dirname, 'modules/core/commands'),
        //path.join(__dirname, 'modules/twitchLive/commands'),
        path.join(__dirname, 'modules/qotd/commands'),
        path.join(__dirname, 'modules/tempVoice/commands'),
        path.join(__dirname, 'modules/customEvents/commands')
    ];

    const readCommands = (dir: string) => {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.lstatSync(filePath);

            if (stat.isDirectory()) {
                readCommands(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);

                if (command.guildOnly) guildCommands.push(command.data);
                else commands.push(command.data);
            }
        }
    };
    for (const cmdPath of categoryFolders) {
        readCommands(cmdPath);
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    try {
        rest.put(Routes.applicationGuildCommands(clientId, OWNER_SERVER_ID), {
            body: guildCommands
        }).then(() =>
            Logger.info(
                `Successfully registered ${guildCommands.length} guild application commands.`
            )
        );

        rest.put(Routes.applicationCommands(clientId), { body: commands }).then(() =>
            Logger.info(`Successfully registered ${commands.length} application commands.`)
        );
    } catch (error: any) {
        Logger.error('Error while registering application commands', error);
    }
};
