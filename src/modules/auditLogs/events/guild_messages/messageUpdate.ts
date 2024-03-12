import { Client, EmbedBuilder, Events, GuildBasedChannel, Message } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embedsUtil';
import { canSendMessage } from '../../../../utils/botUtil';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.MessageUpdate,
    async execute(client: Client, oldMessage: Message, newMessage: Message) {
        const oldText = oldMessage.content;
        const newText = newMessage.content;

        if (oldText === newText || !oldMessage.guild) return;

        const {
            locale: localeLL,
            modules: {
                auditLogs: { messageUpdate }
            }
        } = await guildService.getOrCreateGuild(oldMessage.guild);

        const logChannel = client.guilds.cache
            .get(oldMessage.guild.id)
            ?.channels.cache.get(messageUpdate.channelId!);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreUpdate(messageUpdate, oldMessage, logChannel)) return;

        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.messageUpdate;

        const embed = new EmbedBuilder()
            .setDescription(
                locale.embed.description({
                    userId: oldMessage.author.id,
                    channelId: oldMessage.channelId,
                    url: oldMessage.url
                })
            )
            .addFields([
                {
                    name: locale.embed.fields.oldMessage(),
                    value: oldText,
                    inline: false
                },
                {
                    name: locale.embed.fields.newMessage(),
                    value: newText,
                    inline: false
                }
            ])
            .setFooter({ text: locale.embed.footer.text() })
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
    !canSendMessage(logChannel) ||
    messageUpdate.ignoredChannels.includes(oldMessage.channelId) ||
    messageUpdate.ignoredUsers.includes(oldMessage.author.id);
