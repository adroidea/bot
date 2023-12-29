import { Client, EmbedBuilder, Events, Message, TextChannel } from 'discord.js';
import { ILogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.MessageUpdate,
    async execute(client: Client, oldMessage: Message, newMessage: Message) {
        const oldText = oldMessage.content || '';
        const newText = newMessage.content || '';

        if (oldText === newText || !oldMessage.guild) return;

        const {
            modules: { logs }
        } = await guildService.getOrCreateGuild(oldMessage.guild);
        const { messageUpdate } = logs;

        if (shouldIgnoreUpdate(messageUpdate, oldMessage)) return;

        const logChannel = client.channels.cache.get(messageUpdate.channelId!);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${newMessage.author.username} (${newMessage.author.id})`,
                iconURL: newMessage.author.avatarURL()!
            })
            .setDescription(
                `Message edité dans <#${oldMessage.channelId}>, [voir le message](${oldMessage.url})`
            )
            .addFields([
                {
                    name: `Ancien message :`,
                    value: oldText,
                    inline: false
                },
                {
                    name: `Nouveau message :`,
                    value: newText,
                    inline: false
                }
            ])
            .setFooter({ text: `Message modifié.` })
            .setColor([45, 249, 250])
            .setTimestamp();
        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreUpdate = (messageUpdate: ILogsModule['messageUpdate'], oldMessage: Message) =>
    !messageUpdate.enabled ||
    (messageUpdate.ignoreBots && oldMessage.author.bot) ||
    messageUpdate.ignoredChannels.includes(oldMessage.channelId) ||
    messageUpdate.ignoredUsers.includes(oldMessage.author.id) ||
    messageUpdate.channelId === '';
