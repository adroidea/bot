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
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embeds.util';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

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
            locale: localeLL,
            modules: {
                auditLogs: { messageDelete }
            }
        } = await guildService.getOrCreateGuild(guild);

        const logChannel = getTextChannel(guild, messageDelete.channelId);

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
