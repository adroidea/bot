import { Client, EmbedBuilder, Events, GuildBasedChannel, Message } from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { canSendMessage } from '../../../../utils/botUtil';
import guildService from '../../../../services/guildService';

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
                .setAuthor({
                    name: `${message.author.username} (${message.author.id})`,
                    iconURL: message.author.avatarURL()!
                })
                .setDescription(
                    `Message supprimé de ${message.author.username} dans <#${message.channelId}>, [voir le salon](${message.url})`
                )
                .addFields([
                    {
                        name: `Message supprimé :`,
                        value: '❄ ' + message.content,
                        inline: false
                    }
                ])
                .setFooter({ text: `Message supprimé.` })
                .setColor(Colors.red)
                .setTimestamp();

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
