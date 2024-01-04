import { Client, EmbedBuilder, Events, Role, TextChannel } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildRoleDelete,
    async execute(client: Client, role: Role) {
        console.log(role);
        const {
            modules: {
                auditLogs: { guildRoleDelete }
            }
        } = await guildService.getOrCreateGuild(role.guild);

        if (shouldIgnoreRoleDelete(guildRoleDelete)) return;

        const logChannel = client.channels.cache.get(guildRoleDelete.channelId);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${role.name}`
            })
            .setTitle(`Rôle supprimé`)
            .setDescription(`${role.icon}${role.name}`)
            .setFooter({
                text: "Ca tombe bien, j'aimais pas tant ce rôle !"
            })
            .setTimestamp();

        if (role.color) embed.setColor(role.color);
        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleDelete = (guildRoleDelete: IAuditLogsModule['guildRoleDelete']) =>
    !guildRoleDelete.enabled || guildRoleDelete.channelId === '';
