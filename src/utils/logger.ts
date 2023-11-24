import { Channels, Colors } from './consts';
import { EmbedBuilder, WebhookClient, codeBlock } from 'discord.js';
import ansis, { AnsiColors } from 'ansis';
import { client as discordClient } from '../';

const write = (
    content: string,
    tagColor: AnsiColors,
    bgTagColor: AnsiColors,
    tag: string,
    error = false
) => {
    const stream = error ? process.stderr : process.stdout;
    const tagLabel = `[${tag}]`;
    const item = `${ansis[bgTagColor][tagColor](tagLabel)} ${ansis.white(content)}\n`;
    stream.write(item);
};

const error = (content: string, error: Error, filePath?: string) => {
    write(`${content} \n${filePath}`, 'black', 'bgRed', 'ERROR', true);
    console.error(error);

    sendInternalLogWebhook(
        logType.ERROR,
        `${error.name}: ${error.message}`,
        codeBlock(error.stack!)
    );
};

const warn = (content: string) => {
    write(content, 'black', 'bgYellow', 'WARN', false);
    sendInternalLogWebhook(logType.WARN, '', content);
};

const info = (content: string) => {
    write(content, 'black', 'bgGreen', 'INFO', false);
};

const client = (content: string) => {
    write(content, 'black', 'bgBlue', 'CLIENT', false);
    sendInternalLogWebhook(logType.CLIENT, content);
};

export const logType: { [key: string]: string } = {
    ERROR: 'error',
    WARN: 'warning',
    CLIENT: 'client'
};

export default {
    error,
    warn,
    info,
    client
};

/**
 * Sends an internal log webhook.
 * @param logType - The type of the log.
 * @param title - The title of the log.
 * @param description - The description of the log.
 */
const sendInternalLogWebhook = (logType: string, title?: string, description?: string) => {
    const embed = new EmbedBuilder().setColor(Colors[logType]).setTimestamp();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (discordClient.isReady())
        embed.setFooter({
            text: discordClient.user.username,
            iconURL: discordClient.user?.displayAvatarURL()
        });
    sendWebhook(embed);
};

/**
 * Sends a webhook with the provided embed.
 * @param embed - The embed to send in the webhook.
 */
const sendWebhook = (embed: EmbedBuilder) => {
    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_LOG_URL! });
    webhookClient
        .send({
            threadId: Channels.logsThread,
            username: 'adroid_ea',
            avatarURL:
                'https://cdn.discordapp.com/attachments/763373898779197481/887428474766229574/worldbot.png',
            embeds: [embed]
        })
        .catch(error => console.error(error));
};
