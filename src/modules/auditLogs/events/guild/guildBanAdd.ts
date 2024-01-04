import {
    AuditLogEvent,
    Client,
    EmbedBuilder,
    Events,
    GuildBan,
    TextChannel,
    userMention
} from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildBanAdd,
    async execute(client: Client, ban: GuildBan) {
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd
        });

        const executor = fetchedLogs.entries.first()?.executor;

        const {
            modules: {
                auditLogs: { guildBanAdd }
            }
        } = await guildService.getOrCreateGuild(ban.guild);

        if (shouldIgnoreBanAdd(guildBanAdd)) return;

        const logChannel = client.channels.cache.get(guildBanAdd.channelId);
        const embed = new EmbedBuilder()
            .setThumbnail(ban.user.avatarURL())
            .setTitle("Ban d'un utilisateur")
            .addFields({
                name: '❄ Victime',
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
                    name: `${executor.username} (${executor.id})`,
                    iconURL: executor.avatarURL()!
                })
                .addFields([
                    { name: '\u200B', value: '\u200B', inline: true },
                    {
                        name: '❄ Bourreau',
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

        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreBanAdd = (guildBanAdd: IAuditLogsModule['guildBanAdd']) =>
    !guildBanAdd.enabled || guildBanAdd.channelId === '';
