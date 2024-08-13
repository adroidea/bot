import { AuditLogEvent, Client, EmbedBuilder, Events, Role } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embeds.util';
import { addPermissionsNames } from '../../../../utils/modules.uil';
import { getOneGuildCache } from '../../../core/tasks/createCache.cron';
import { loadLL } from '../../../../i18n/formatters';

export default {
    name: Events.GuildRoleCreate,
    async execute(client: Client, role: Role) {
        const guild = getOneGuildCache(role.guild.id);
        if (!guild) return;

        const { guildRoleCreate } = guild.modules.auditLogs;

        if (shouldIgnoreRoleCreate(guildRoleCreate)) return;

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate
        });

        const logChannel = client.channels.cache.get(guildRoleCreate.channelId);
        if (!logChannel?.isTextBased()) return;

        const LL = await loadLL(guild.locale);
        const locale = LL.modules.auditLogs.guildRoleCreate;

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

const shouldIgnoreRoleCreate = (guildRoleCreate: IAuditLogsModule['guildRoleCreate']) =>
    !guildRoleCreate.enabled || guildRoleCreate.channelId === '';
