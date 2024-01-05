import { Client, EmbedBuilder, Events, Role } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildRoleCreate,
    async execute(client: Client, role: Role) {
        console.log(role);
        const {
            modules: {
                auditLogs: { guildRoleCreate }
            }
        } = await guildService.getOrCreateGuild(role.guild);

        if (shouldIgnoreRoleCreate(guildRoleCreate)) return;

        const logChannel = client.channels.cache.get(guildRoleCreate.channelId);
        if (!logChannel?.isTextBased()) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${role.name}`
            })
            .setTitle(`Nouveau rôle créé`)
            .setDescription(`${role.icon}${role.name}`)
            .setFooter({
                text: 'Qui aura droit à ce super rôle ?'
            })
            .setTimestamp();

        if (role.color) embed.setColor(role.color);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleCreate = (guildRoleCreate: IAuditLogsModule['guildRoleCreate']) =>
    !guildRoleCreate.enabled || guildRoleCreate.channelId === '';
