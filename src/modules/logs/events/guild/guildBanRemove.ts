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
import { ILogsModule } from 'adroi.d.ea';
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
            modules: { logs }
        } = await guildService.getOrCreateGuild(ban.guild);
        const { guildBanRemove } = logs;

        if (shouldIgnoreBanRemove(guildBanRemove)) return;

        const logChannel = client.channels.cache.get(guildBanRemove.channelId);
        const embed = new EmbedBuilder()
            .setThumbnail(ban.user.avatarURL())
            .setTitle(`Unban d'un utilisateur`)
            .addFields({
                name: '❄ Béni :',
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
                .addFields({
                    name: '❄ bienfaiteur :',
                    value: userMention(executor.id),
                    inline: true
                });

        if (ban.reason)
            embed.addFields({
                name: '❄ Raison :',
                value: ban.reason,
                inline: false
            });

        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreBanRemove = (guildBanAdd: ILogsModule['guildBanAdd']) =>
    !guildBanAdd.enabled || guildBanAdd.channelId === '';
