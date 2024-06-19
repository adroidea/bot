import { Client, EmbedBuilder, Events, GuildBasedChannel, Message } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embeds.util';
import { canSendMessage } from '../../../../utils/bot.util';
import guildService from '../../../../services/guild.service';

export default {
    name: Events.MessageUpdate,
    async execute(client: Client, oldMessage: Message, newMessage: Message) {
        const oldText = oldMessage.content;
        const newText = newMessage.content;

        if (oldText === newText || !oldMessage.guild) return;

        const {
            modules: {
                auditLogs: { messageUpdate }
            }
        } = await guildService.getOrCreateGuild(oldMessage.guild);

        const logChannel = client.guilds.cache
            .get(oldMessage.guild.id)
            ?.channels.cache.get(messageUpdate.channelId!);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreUpdate(messageUpdate, oldMessage, logChannel)) return;

        const embed = new EmbedBuilder()
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

        addAuthor(embed, oldMessage.author);

        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreUpdate = (
    messageUpdate: IAuditLogsModule['messageUpdate'],
    oldMessage: Message,
    logChannel: GuildBasedChannel | undefined
) =>
    !messageUpdate.enabled ||
    messageUpdate.channelId === '' ||
    (messageUpdate.ignoreBots && oldMessage.author.bot) ||
    canSendMessage(logChannel) ||
    messageUpdate.ignoredChannels.includes(oldMessage.channelId) ||
    messageUpdate.ignoredUsers.includes(oldMessage.author.id);
