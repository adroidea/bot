import { Client, EmbedBuilder, Events, GuildBasedChannel, GuildMember } from 'discord.js';
import { canSendMessage, timestampToDate } from '../../../../utils/botUtil';
import { Colors } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildMemberRemove,
    async execute(client: Client, member: GuildMember) {
        const {
            modules: {
                auditLogs: { guildMemberRemove }
            }
        } = await guildService.getOrCreateGuild(member.guild);

        const logChannel = client.guilds.cache
            .get(member.guild.id)
            ?.channels.cache.get(guildMemberRemove.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreMemberRemove(guildMemberRemove, member, logChannel)) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.id}`,
                iconURL: member.user.avatarURL()!
            })
            .setThumbnail(
                'https://cdn.discordapp.com/attachments/779901444408606730/918202331743539200/unknown.png'
            )
            .setTitle(`${member.user.username} nous a quitté!`)
            .setDescription(`Weaklings Die. Big Deal.`)
            .addFields(
                {
                    name: '❄ Création :',
                    value: `<t:${timestampToDate(member.user.createdTimestamp)}:R>`,
                    inline: true
                },
                {
                    name: '❄ Rejoint :',
                    value: `<t:${timestampToDate(member.joinedTimestamp!)}:R>`,
                    inline: true
                },
                {
                    name: '❄ Nombre de membres :',
                    value: `${member.guild.memberCount}`,
                    inline: false
                }
            )
            .setFooter({
                text: 'So long partner.',
                iconURL: member.user.avatarURL()!
            })
            .setTimestamp()
            .setColor(Colors.random);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreMemberRemove = (
    guildMemberRemove: IAuditLogsModule['guildMemberRemove'],
    member: GuildMember,
    logChannel: GuildBasedChannel | undefined
) =>
    !guildMemberRemove.enabled ||
    guildMemberRemove.channelId === '' ||
    (guildMemberRemove.ignoreBots && member.user.bot) ||
    canSendMessage(logChannel);
