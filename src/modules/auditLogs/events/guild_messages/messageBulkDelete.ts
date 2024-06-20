import {
    Client,
    Collection,
    EmbedBuilder,
    Events,
    GuildBasedChannel,
    GuildTextBasedChannel,
    Message,
    PartialMessage,
    Snowflake,
    quote,
    userMention
} from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { canSendMessage } from '../../../../utils/bot.util';
import guildService from '../../../../services/guild.service';

export default {
    name: Events.MessageBulkDelete,
    async execute(
        client: Client,
        messages: Collection<Snowflake, Message | PartialMessage>,
        channel: GuildTextBasedChannel
    ) {
        if (!channel.guild) return;

        const {
            modules: {
                auditLogs: { messageBulkDelete }
            }
        } = await guildService.getOrCreateGuild(channel.guild);

        const logChannel = client.guilds.cache
            .get(channel.guild.id)
            ?.channels.cache.get(messageBulkDelete.channelId!);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreBulkDelete(messageBulkDelete, channel.id, logChannel)) return;

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
            .map(([id, count]) => quote(userMention(id)) + `: ${count} messages`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setDescription(
                `${messages.size} messages supprimés dans <#${channel.id}>\n${participantsList}`
            )
            .setFooter({ text: `Suppression de masse.` })
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
    canSendMessage(logChannel) ||
    messageBulkDelete.ignoredChannels.includes(channelId);
