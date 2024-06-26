import { Client, EmbedBuilder, Events, GuildMember, inlineCode } from 'discord.js';
import { Colors, Emojis } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embeds.util';
import { detailedShortDate } from '../../../../utils/bot.util';
import guildService from '../../../../services/guild.service';

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

        if (shouldIgnoreMemberRemove(guildMemberRemove, member)) return;

        const embed = new EmbedBuilder()
            .setDescription(`Weaklings Die. Big Deal.`)
            .addFields(
                {
                    name: `${Emojis.snowflake} Membre`,
                    value: `${member.nickname ? member.nickname : member.displayName} ${inlineCode(
                        member.user.username
                    )} (${member.user.id})`
                },
                {
                    name: `${Emojis.snowflake} Création`,
                    value: `${detailedShortDate(member.user.createdTimestamp)}`,
                    inline: true
                },
                {
                    name: `${Emojis.snowflake} Rejoint`,
                    value: `${detailedShortDate(member.joinedTimestamp!)}`,
                    inline: true
                },
                {
                    name: `${Emojis.snowflake} Départ`,
                    value: `${detailedShortDate(Date.now())}`,
                    inline: true
                }
            )
            .setFooter({
                text: 'Utilisateur parti',
                iconURL: member.user.avatarURL()!
            })
            .setTimestamp()
            .setColor(Colors.random);

        addAuthor(embed, member.user);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreMemberRemove = (
    guildMemberRemove: IAuditLogsModule['guildMemberRemove'],
    member: GuildMember
) =>
    !guildMemberRemove.enabled ||
    guildMemberRemove.channelId === '' ||
    (guildMemberRemove.ignoreBots && member.user.bot);
