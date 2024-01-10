import { AuditLogEvent, Client, EmbedBuilder, Events, Role } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { getPermissionsNames } from '../../../../utils/modulesUil';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildRoleDelete,
    async execute(client: Client, role: Role) {
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete
        });

        const {
            modules: {
                auditLogs: { guildRoleDelete }
            }
        } = await guildService.getOrCreateGuild(role.guild);

        if (shouldIgnoreRoleDelete(guildRoleDelete)) return;

        const logChannel = client.channels.cache.get(guildRoleDelete.channelId);
        if (!logChannel?.isTextBased()) return;

        const embed = new EmbedBuilder()
            .setTitle(`Rôle __${role.name}__ supprimé`)
            .setFooter({
                text: 'Rôle supprimé'
            })
            .setTimestamp();

        const executor = fetchedLogs.entries.first()?.executor;
        if (executor)
            embed.setAuthor({
                name: `${executor.username} (${executor.id})`,
                iconURL: executor.displayAvatarURL()!
            });

        const categorizedPermissions = getPermissionsNames(role.permissions);
        for (const [category, perms] of Object.entries(categorizedPermissions)) {
            embed.addFields({
                name: category,
                value: perms.join('\n'),
                inline: true
            });
        }

        if (role.color) embed.setColor(role.color);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleDelete = (guildRoleDelete: IAuditLogsModule['guildRoleDelete']) =>
    !guildRoleDelete.enabled || guildRoleDelete.channelId === '';
