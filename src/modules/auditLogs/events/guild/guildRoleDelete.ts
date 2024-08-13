import { AuditLogEvent, Client, EmbedBuilder, Events, Role } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embeds.util';
import { addPermissionsNames } from '../../../../utils/modules.uil';
import { getOneGuildCache } from '../../../core/tasks/createCache.cron';
import { loadLL } from '../../../../i18n/formatters';

export default {
    name: Events.GuildRoleDelete,
    async execute(client: Client, role: Role) {
        const guild = getOneGuildCache(role.guild.id);
        if (!guild) return;

        const { guildRoleDelete } = guild.modules.auditLogs;
        if (shouldIgnoreRoleDelete(guildRoleDelete)) return;

        const logChannel = client.channels.cache.get(guildRoleDelete.channelId);
        if (!logChannel?.isTextBased()) return;

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete
        });

        const LL = await loadLL(guild.locale);
        const locale = LL.modules.auditLogs.guildRoleDelete;

        const embed = new EmbedBuilder()
            .setTitle(locale.embed.title({ roleName: role.name }))
            .setFooter({
                text: locale.embed.footer()
            })
            .setTimestamp();

        const executor = fetchedLogs.entries.first()?.executor;
        addAuthor(embed, executor);

        addPermissionsNames(role.permissions, embed);

        if (role.color) embed.setColor(role.color);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleDelete = (guildRoleDelete: IAuditLogsModule['guildRoleDelete']) =>
    !guildRoleDelete.enabled || guildRoleDelete.channelId === '';
