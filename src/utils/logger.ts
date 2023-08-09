import { EmbedBuilder, WebhookClient, codeBlock } from 'discord.js';
import ansis, { AnsiColors } from 'ansis';
import { Colors } from './consts';

const format = '{tstamp} : {tag} {txt} \n';

export default class Logger {
    private static write(
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

        sendLogWebhook(logType.ERROR, `${error.name}: ${error.message}`, codeBlock(error.stack!));
    }

    static warn(content: string) {
        Logger.write(content, 'black', 'bgYellow', 'WARN', false);
        sendLogWebhook(logType.WARN, '', content);
    }

    static info(content: string) {
        Logger.write(content, 'black', 'bgGreen', 'INFO', false);
    }

    static client(content: string) {
        Logger.write(content, 'black', 'bgBlue', 'CLIENT', false);
        sendLogWebhook(logType.CLIENT, content);
    }
}

enum logType {
    ERROR = 'error',
    WARN = 'warning',
    CLIENT = 'client'
}

const sendLogWebhook = (logType: logType, title?: string, description?: string) => {
    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_LOG_URL! });
    const embed = new EmbedBuilder().setColor(Colors[logType]).setTimestamp();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);

    webhookClient
        .send({
            username: 'adroid_ea',
            avatarURL:
                'https://cdn.discordapp.com/attachments/763373898779197481/887428474766229574/worldbot.png',
            embeds: [embed]
        })
        .catch(error => console.error(error));
};
