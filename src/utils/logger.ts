import { EmbedBuilder, WebhookClient, codeBlock } from 'discord.js';
import ansis, { AnsiColors } from 'ansis';
import { Colors } from './consts';

const format = '{tag} {txt} \n';

export default class Logger {
    private static write(
        content: string,
        tagColor: AnsiColors,
        bgTagColor: AnsiColors,
        tag: string,
        error = false
    ) {
        const logTag = `[${tag}]`;
        const stream = error ? process.stderr : process.stdout;
        const item = format
            .replace('{tag}', ansis[bgTagColor][tagColor](logTag))
            .replace('{txt}', ansis.white(content));
        stream.write(item);
    }

    static async error(content: string, error: Error, filePath?: string) {
        Logger.write(`${content} \n${filePath}`, 'black', 'bgRed', 'ERROR', true);
        console.error(error);

        sendInternalLogWebhook(
            logType.ERROR,
            `${error.name}: ${error.message}`,
            codeBlock(error.stack!)
        );
    }

    static warn(content: string) {
        Logger.write(content, 'black', 'bgYellow', 'WARN', false);
        sendInternalLogWebhook(logType.WARN, '', content);
    }

    static info(content: string) {
        Logger.write(content, 'black', 'bgGreen', 'INFO', false);
    }

    static client(content: string) {
        Logger.write(content, 'black', 'bgBlue', 'CLIENT', false);
        sendInternalLogWebhook(logType.CLIENT, content);
    }
}

export enum logType {
    ERROR = 'error',
    WARN = 'warning',
    CLIENT = 'client'
}

const sendInternalLogWebhook = (logType: logType, title?: string, description?: string) => {
    const embed = new EmbedBuilder().setColor(Colors[logType]).setTimestamp();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    senddWebhook(embed);
};

const senddWebhook = (embed: EmbedBuilder) => {
    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_LOG_URL! });
    webhookClient
        .send({
            username: 'adroid_ea',
            avatarURL:
                'https://cdn.discordapp.com/attachments/763373898779197481/887428474766229574/worldbot.png',
            embeds: [embed]
        })
        .catch(error => console.error(error));
};
