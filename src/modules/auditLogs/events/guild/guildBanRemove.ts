import {
    AuditLogEvent,
    Client,
    EmbedBuilder,
    Events,
    GuildBan,
    GuildBasedChannel,
    userMention
} from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { canSendMessage } from '../../../../utils/botUtil';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildBanRemove,
    async execute(client: Client, ban: GuildBan) {
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove
        });

        const executor = fetchedLogs.entries.first()?.executor;

        const {
            modules: {
                auditLogs: { guildBanRemove }
            }
        } = await guildService.getOrCreateGuild(ban.guild);

        const logChannel = client.guilds.cache
            .get(ban.guild.id)
            ?.channels.cache.get(guildBanRemove.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreBanRemove(guildBanRemove, logChannel)) return;

        const embed = new EmbedBuilder()
            .setThumbnail(ban.user.avatarURL())
            .setTitle(`Unban d'un utilisateur`)
            .addFields({
                name: '❄ Béni',
                value: userMention(ban.user.id),
                inline: true
            })
            .setFooter({
                text: `${ban.user.username} (${ban.user.id})`,
                iconURL: ban.user.avatarURL()!
            })
            .setTimestamp()
            .setColor(Colors.random);

        if (executor)
            embed
                .setAuthor({
                    name: executor.username,
                    iconURL: executor.avatarURL()!
                })
                .addFields([
                    { name: '\u200B', value: '\u200B', inline: true },
                    {
                        name: '❄ bienfaiteur',
                        value: userMention(executor.id),
                        inline: true
                    }
                ]);

        if (ban.reason)
            embed.addFields({
                name: '❄ Raison :',
                value: ban.reason,
                inline: false
            });

        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreBanRemove = (
    guildBanAdd: IAuditLogsModule['guildBanAdd'],
    logChannel: GuildBasedChannel | undefined
) => !guildBanAdd.enabled || guildBanAdd.channelId === '' || canSendMessage(logChannel);
