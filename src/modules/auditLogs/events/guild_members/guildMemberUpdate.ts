import { Client, Events, GuildMember, TextChannel, userMention } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { IAuditLogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildMemberUpdate,
    async execute(client: Client, oldMember: GuildMember, newMember: GuildMember) {
        const {
            modules: {
                auditLogs: { guildMemberUpdate }
            }
        } = await guildService.getOrCreateGuild(newMember.guild);

        if (shouldIgnoreMemberUpdate(guildMemberUpdate, oldMember, newMember)) return;

        const logChannel = client.channels.cache.get(guildMemberUpdate.channelId);

        if (logChannel) {
            if (oldMember.nickname !== newMember.nickname) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${newMember.user.username}`,
                        iconURL: newMember.avatarURL()!
                    })
                    .setDescription(`${userMention(newMember.id)} a changé de pseudo`)
                    .addFields([
                        {
                            name: 'Ancien',
                            value: oldMember.nickname ?? oldMember.user.username,
                            inline: false
                        },
                        {
                            name: 'Nouveau',
                            value: newMember.nickname ?? newMember.user.username,
                            inline: false
                        }
                    ])
                    .setFooter({ text: `ID: ${newMember.id}` })
                    .setColor([186, 45, 250])
                    .setTimestamp();

                await (logChannel as TextChannel).send({ embeds: [embed] });
            }
        }
    }
};

const shouldIgnoreMemberUpdate = (
    guildMemberUpdate: IAuditLogsModule['guildMemberUpdate'],
    oldMember: GuildMember,
    newMember: GuildMember
) =>
    !guildMemberUpdate.enabled ||
    (guildMemberUpdate.ignoreBots && newMember.user.bot) ||
    guildMemberUpdate.ignoredUsers.includes(newMember.id) ||
    guildMemberUpdate.channelId === '';
