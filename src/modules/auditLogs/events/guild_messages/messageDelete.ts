import {
    Client,
    EmbedBuilder,
    Events,
    GuildBasedChannel,
    Message,
    PermissionsBitField
} from 'discord.js';
import { Colors, Emojis } from '../../../../utils/consts';
import {
    canSendMessage,
    getTextChannel,
    hasBotPermission,
    warnOwnerNoPermissions
} from '../../../../utils/bot.util';
import { CustomErrors } from '../../../../utils/errors';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embeds.util';
import guildService from '../../../../services/guild.service';

export default {
    name: Events.MessageDelete,
    async execute(client: Client, message: Message) {
        const permissions: bigint[] = [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.EmbedLinks
        ];

        if (!message.guildId) return;

        const guild = client.guilds.cache.get(message.guildId);
        if (!guild) return;

        try {
            if (!hasBotPermission(guild, permissions))
                throw CustomErrors.SelfNoPermissionsError(guild, permissions);
        } catch (error) {
            warnOwnerNoPermissions(guild, permissions);
        }

        const {
            modules: {
                auditLogs: { messageDelete }
            }
        } = await guildService.getOrCreateGuild(guild);

        const logChannel = getTextChannel(guild, messageDelete.channelId);

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
) => {
    const moduleEnabled = messageDelete.enabled;
    const channelId = messageDelete.channelId;
    const ignoreBots = messageDelete.ignoreBots && message.author.bot;
    const canSend = canSendMessage(logChannel);
    const ignoredChannel = messageDelete.ignoredChannels.includes(message.channelId);
    const ignoredUser = messageDelete.ignoredUsers.includes(message.author.id);

    return (
        !moduleEnabled ||
        channelId === '' ||
        ignoreBots ||
        !canSend ||
        ignoredChannel ||
        ignoredUser
    );
};
