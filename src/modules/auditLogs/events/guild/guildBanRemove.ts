import {
    AuditLogEvent,
    Client,
    EmbedBuilder,
    Events,
    GuildBan,
    GuildTextBasedChannel,
    PermissionsBitField,
    userMention
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
    name: Events.GuildBanRemove,
    async execute(_: Client, ban: GuildBan) {
        const permissions: bigint[] = [
            PermissionsBitField.Flags.ViewAuditLog,
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.EmbedLinks
        ];

        try {
            if (!hasBotPermission(ban.guild, permissions))
                throw CustomErrors.SelfNoPermissionsError(ban.guild, permissions);
        } catch (error) {
            warnOwnerNoPermissions(ban.guild, permissions);
        }
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove
        });

        const {
            modules: {
                auditLogs: { guildBanRemove }
            }
        } = await guildService.getOrCreateGuild(ban.guild);

        const logChannel = getTextChannel(ban.guild, guildBanRemove.channelId);

        if (shouldIgnoreBanRemove(guildBanRemove, logChannel)) return;

        const embed = new EmbedBuilder()
            .setThumbnail(ban.user.avatarURL())
            .setTitle(`Unban d'un utilisateur`)
            .addFields({
                name: `${Emojis.snowflake} Béni`,
                value: userMention(ban.user.id),
                inline: true
            })
            .setFooter({
                text: `${ban.user.username} (${ban.user.id})`,
                iconURL: ban.user.avatarURL()!
            })
            .setTimestamp()
            .setColor(Colors.random);

        const executor = fetchedLogs.entries.first()?.executor;
        if (executor) {
            addAuthor(embed, executor);
            embed.addFields([
                { name: '\u200B', value: '\u200B', inline: true },
                {
                    name: `${Emojis.snowflake} Bienfaiteur`,
                    value: userMention(executor.id),
                    inline: true
                }
            ]);
        }
        if (ban.reason)
            embed.addFields({
                name: `${Emojis.snowflake} Raison`,
                value: ban.reason,
                inline: false
            });

        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreBanRemove = (
    guildBanAdd: IAuditLogsModule['guildBanAdd'],
    logChannel: GuildTextBasedChannel
) => !guildBanAdd.enabled || guildBanAdd.channelId === '' || canSendMessage(logChannel);
