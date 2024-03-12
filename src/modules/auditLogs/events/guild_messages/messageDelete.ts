import { Client, EmbedBuilder, Events, GuildBasedChannel, Message } from 'discord.js';
import { Colors, Emojis } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embedsUtil';
import { canSendMessage } from '../../../../utils/botUtil';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.MessageDelete,
    async execute(client: Client, message: Message) {
        if (!message.guild) return;

        const {
            locale: localeLL,
            modules: {
                auditLogs: { messageDelete }
            }
        } = await guildService.getOrCreateGuild(message.guild);

        const logChannel = client.guilds.cache
            .get(message.guild.id)
            ?.channels.cache.get(messageDelete.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreDelete(messageDelete, message, logChannel)) return;

        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.messageDelete;

        if (message.content && logChannel) {
            const embed = new EmbedBuilder()
                .setDescription(
                    locale.embed.description({
                        userId: message.author.id,
                        channelId: message.channelId,
                        url: message.url
                    })
                )
                .addFields([
                    {
                        name: locale.embed.fields.message(),
                        value: Emojis.snowflake + ' ' + message.content,
                        inline: false
                    }
                ])
                .setFooter({ text: locale.embed.footer.text() })
                .setColor(Colors.red)
                .setTimestamp();

            addAuthor(embed, message.author);

            await logChannel.send({ embeds: [embed] });
        }
    }
};

const shouldIgnoreDelete = (
    messageDelete: IAuditLogsModule['messageDelete'],
    message: Message,
    logChannel: GuildBasedChannel | undefined
) =>
    !messageDelete.enabled ||
    messageDelete.channelId === '' ||
    (messageDelete.ignoreBots && message.author.bot) ||
    !canSendMessage(logChannel) ||
    messageDelete.ignoredChannels.includes(message.channelId) ||
    messageDelete.ignoredUsers.includes(message.author.id);
