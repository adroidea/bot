import { Client, EmbedBuilder, Events, GuildMember } from 'discord.js';
import { Colors, Emojis } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { addAuthor } from '../../../../utils/embedsUtil';
import guildService from '../../../../services/guild.service';
import { timestampToDate } from '../../../../utils/botUtil';

export default {
    name: Events.GuildMemberAdd,
    async execute(client: Client, member: GuildMember) {
        const {
            modules: {
                auditLogs: { guildMemberAdd }
            }
        } = await guildService.getOrCreateGuild(member.guild);

        const logChannel = client.guilds.cache
            .get(member.guild.id)
            ?.channels.cache.get(guildMemberAdd.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreMemberAdd(guildMemberAdd, member)) return;

        const embed = new EmbedBuilder()
            .setThumbnail(member.user.avatarURL())
            .setTitle(`${Emojis.pikaHi} Bienvenue sur le serveur ${member.user.username} !`)
            .setDescription(
                `Bonjour à toi ! Nous souhaitons que ton expérience parmi nous soit aussi plaisante que possible, et nous nous y emploierons constamment.`
            )
            .addFields({
                name: `${Emojis.snowflake} Création`,
                value: `<t:${timestampToDate(member.user.createdTimestamp)}:R>`,
                inline: true
            })
            .setFooter({
                text: 'Utilisateur rejoint'
            })
            .setTimestamp()
            .setColor(Colors.random);

        addAuthor(embed, member.user);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreMemberAdd = (
    guildMemberAdd: IAuditLogsModule['guildMemberAdd'],
    member: GuildMember
) =>
    !guildMemberAdd.enabled ||
    guildMemberAdd.channelId === '' ||
    (guildMemberAdd.ignoreBots && member.user.bot);
