import { AuditLogEvent, Client, EmbedBuilder, Events, Role } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embedsUtil';
import { addPermissionsNames } from '../../../../utils/modulesUil';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildRoleCreate,
    async execute(client: Client, role: Role) {
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate
        });

        const {
            modules: {
                auditLogs: { guildRoleCreate }
            }
        } = await guildService.getOrCreateGuild(role.guild);

        if (shouldIgnoreRoleCreate(guildRoleCreate)) return;

        const logChannel = client.channels.cache.get(guildRoleCreate.channelId);
        if (!logChannel?.isTextBased()) return;

        const embed = new EmbedBuilder()
            .setTitle(`Rôle __${role.name}__ créé`)
            .setFooter({
                text: 'Rôle créé'
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
