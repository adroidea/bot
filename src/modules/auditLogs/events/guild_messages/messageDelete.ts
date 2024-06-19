import { Client, EmbedBuilder, Events, GuildBasedChannel, Message } from 'discord.js';
import { Colors, Emojis } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embeds.util';
import { canSendMessage } from '../../../../utils/bot.util';
import guildService from '../../../../services/guild.service';

export default {
    name: Events.MessageDelete,
    async execute(client: Client, message: Message) {
        if (!message.guild) return;

        const {
            modules: {
                auditLogs: { messageDelete }
            }
        } = await guildService.getOrCreateGuild(message.guild);

        const logChannel = client.guilds.cache
            .get(message.guild.id)
            ?.channels.cache.get(messageDelete.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreDelete(messageDelete, message, logChannel)) return;

        if (message.content && logChannel) {
            const embed = new EmbedBuilder()
                .setDescription(
                    `Message supprimé de ${message.author.username} dans <#${message.channelId}>, [voir le salon](${message.url})`
                )
                .addFields([
                    {
                        name: `Message supprimé :`,
                        value: Emojis.snowflake + ' ' + message.content,
                        inline: false
                    }
                ])
                .setFooter({ text: `Message supprimé.` })
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
    canSendMessage(logChannel) ||
    messageDelete.ignoredChannels.includes(message.channelId) ||
    messageDelete.ignoredUsers.includes(message.author.id);
