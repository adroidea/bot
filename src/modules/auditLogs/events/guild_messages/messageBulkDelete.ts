import {
    Client,
    Collection,
    EmbedBuilder,
    Events,
    GuildTextBasedChannel,
    Message,
    PartialMessage,
    Snowflake,
    TextChannel,
    quote,
    userMention
} from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

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

        if (shouldIgnoreBulkDelete(messageBulkDelete, channel.id)) return;

        const logChannel = client.channels.cache.get(messageBulkDelete.channelId!);
        if (!logChannel || !logChannel?.isTextBased()) return;

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

        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreBulkDelete = (
    messageBulkDelete: IAuditLogsModule['messageBulkDelete'],
    channelId: string
) =>
    !messageBulkDelete.enabled ||
    messageBulkDelete.ignoredChannels.includes(channelId) ||
    messageBulkDelete.channelId === '';
