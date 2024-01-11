import {
    Client,
    EmbedBuilder,
    Events,
    GuildBasedChannel,
    GuildMember,
    userMention
} from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embedsUtil';
import { canSendMessage } from '../../../../utils/botUtil';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildMemberUpdate,
    async execute(client: Client, oldMember: GuildMember, newMember: GuildMember) {
        if (oldMember.nickname === newMember.nickname) return;
        console.log(oldMember, newMember);

        const {
            modules: {
                auditLogs: { guildMemberUpdate }
            }
        } = await guildService.getOrCreateGuild(newMember.guild);

        const logChannel = client.guilds.cache
            .get(newMember.guild.id)
            ?.channels.cache.get(guildMemberUpdate.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreMemberUpdate(guildMemberUpdate, oldMember, logChannel)) return;

        const embed = new EmbedBuilder()
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

        addAuthor(embed, newMember.user);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreMemberUpdate = (
    guildMemberUpdate: IAuditLogsModule['guildMemberUpdate'],
    member: GuildMember,
    logChannel: GuildBasedChannel | undefined
) =>
    !guildMemberUpdate.enabled ||
    guildMemberUpdate.channelId === '' ||
    (guildMemberUpdate.ignoreBots && member.user.bot) ||
    canSendMessage(logChannel) ||
    guildMemberUpdate.ignoredUsers.includes(member.id);
