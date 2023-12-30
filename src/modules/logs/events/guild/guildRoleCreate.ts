import { Client, EmbedBuilder, Events, Role, TextChannel } from 'discord.js';
import { ILogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildRoleCreate,
    async execute(client: Client, role: Role) {
        console.log(role);
        const {
            modules: { logs }
        } = await guildService.getOrCreateGuild(role.guild);
        const { guildRoleCreate } = logs;

        if (shouldIgnoreRoleCreate(guildRoleCreate)) return;

        const logChannel = client.channels.cache.get(guildRoleCreate.channelId);
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
        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleCreate = (guildRoleCreate: ILogsModule['guildRoleCreate']) =>
    !guildRoleCreate.enabled || guildRoleCreate.channelId === '';
