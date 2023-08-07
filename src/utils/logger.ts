import { TextBasedChannel, codeBlock } from 'discord.js';
import ansis, { AnsiColors } from 'ansis';
import { Embed } from './embedsUtil';
import { LOG_CHANNEL_ID } from './consts';
import { client } from '..';

const format = '{tstamp} : {tag} {txt} \n';

export default class Logger {
    private static async write(
        content: string,
        tagColor: AnsiColors,
        bgTagColor: AnsiColors,
        tag: string,
        error = false
    ) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timestamp = `[${day}/${month} - ${hours}:${minutes}:${seconds}]`;
        const logTag = `[${tag}]`;
        const stream = error ? process.stderr : process.stdout;
        const item = format
            .replace('{tstamp}', ansis.gray(timestamp))
            .replace('{tag}', ansis[bgTagColor][tagColor](logTag))
            .replace('{txt}', ansis.white(content));
        stream.write(item);
    }

    static async error(content: string, error: Error, filePath?: string) {
        Logger.write(`${content} \n${filePath}`, 'black', 'bgRed', 'ERROR', true);
        console.error(error);

        const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
        const embed = Embed.error(`${error.name}: ${error.message}`);
        embed.setDescription(codeBlock(error.stack!));
        (logChannel as TextBasedChannel).send({ embeds: [embed] });
    }

    static warn(content: string) {
        Logger.write(content, 'black', 'bgYellow', 'WARN', false);
    }

    static info(content: string) {
        Logger.write(content, 'black', 'bgGreen', 'INFO', false);
    }

    static client(content: string) {
        Logger.write(content, 'black', 'bgBlue', 'CLIENT', false);
    }
}
