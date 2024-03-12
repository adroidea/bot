import {
    Client,
    Collection,
    EmbedBuilder,
    Events,
    GuildBasedChannel,
    GuildTextBasedChannel,
    Message,
    PartialMessage,
    Snowflake
} from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { canSendMessage } from '../../../../utils/botUtil';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.MessageBulkDelete,
    async execute(
        client: Client,
        messages: Collection<Snowflake, Message | PartialMessage>,
        channel: GuildTextBasedChannel
    ) {
        if (!channel.guild) return;

        const {
            locale: localeLL,
            modules: {
                auditLogs: { messageBulkDelete }
            }
        } = await guildService.getOrCreateGuild(channel.guild);

        const logChannel = client.guilds.cache
            .get(channel.guild.id)
            ?.channels.cache.get(messageBulkDelete.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreBulkDelete(messageBulkDelete, channel.id, logChannel)) return;

        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.messageBulkDelete;

        const participantsList = Array.from(
            messages
                .reduce((acc, msg) => {
                    const authorId = msg.author ? msg.author.id : 'unknown';

                    const count = acc.get(authorId) || 0;
                    acc.set(authorId, count + 1);

                    return acc;
                }, new Map<string, number>())
                .entries()
        )
            .map(([id, count]) => locale.messages({ id, count }))
            .join('\n');

        const embed = new EmbedBuilder()
            .setDescription(
                locale.embed.description({
                    amount: messages.size,
                    channelId: channel.id,
                    usersDeleted: participantsList
                })
            )
            .setFooter({ text: locale.embed.footer.text() })
            .setColor([45, 249, 250])
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreBulkDelete = (
    messageBulkDelete: IAuditLogsModule['messageBulkDelete'],
    channelId: string,
    logChannel: GuildBasedChannel | undefined
) =>
    !messageBulkDelete.enabled ||
    messageBulkDelete.channelId === '' ||
    !canSendMessage(logChannel) ||
    messageBulkDelete.ignoredChannels.includes(channelId);
