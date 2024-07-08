import { Client, EmbedBuilder, Events, GuildBasedChannel, GuildMember } from 'discord.js';
import { canSendMessage, timestampToDate } from '../../../../utils/bot.util';
import { Colors } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embeds.util';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.GuildMemberAdd,
    async execute(client: Client, member: GuildMember) {
        const {
            locale: localeLL,
            modules: {
                auditLogs: { guildMemberAdd }
            }
        } = await guildService.getOrCreateGuild(member.guild);

        const logChannel = client.guilds.cache
            .get(member.guild.id)
            ?.channels.cache.get(guildMemberAdd.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreMemberAdd(guildMemberAdd, member, logChannel)) return;

        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.guildMemberAdd;
        const embed = new EmbedBuilder()
            .setThumbnail(member.user.avatarURL())
            .setTitle(locale.embed.title({ username: member.user.username }))
            .setDescription(locale.embed.description())
            .addFields({
                name: locale.embed.fields.created(),
                value: `<t:${timestampToDate(member.user.createdTimestamp)}:R>`,
                inline: true
            })
            .setFooter({
                text: locale.embed.footer.text()
            })
            .setTimestamp()
            .setColor(Colors.random);

        addAuthor(embed, member.user);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreMemberAdd = (
    guildMemberAdd: IAuditLogsModule['guildMemberAdd'],
    member: GuildMember,
    logChannel: GuildBasedChannel | undefined
) =>
    !guildMemberAdd.enabled ||
    guildMemberAdd.channelId === '' ||
    (guildMemberAdd.ignoreBots && member.user.bot) ||
    !canSendMessage(logChannel);
