import {
    Client,
    EmbedBuilder,
    Events,
    GuildBasedChannel,
    GuildMember,
    inlineCode
} from 'discord.js';
import { canSendMessage, detailedShortDate } from '../../../../utils/botUtil';
import { Colors } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embedsUtil';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.GuildMemberRemove,
    async execute(client: Client, member: GuildMember) {
        const {
            locale: localeLL,
            modules: {
                auditLogs: { guildMemberRemove }
            }
        } = await guildService.getOrCreateGuild(member.guild);

        const logChannel = client.guilds.cache
            .get(member.guild.id)
            ?.channels.cache.get(guildMemberRemove.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreMemberRemove(guildMemberRemove, member, logChannel)) return;

        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.guildMemberRemove;
        const embed = new EmbedBuilder()
            .setDescription(locale.embed.description())
            .addFields(
                {
                    name: locale.embed.fields.member(),
                    value: `${member.nickname ? member.nickname : member.displayName} ${inlineCode(
                        member.user.username
                    )} (${member.user.id})`
                },
                {
                    name: locale.embed.fields.creation(),
                    value: `${detailedShortDate(member.user.createdTimestamp)}`,
                    inline: true
                },
                {
                    name: locale.embed.fields.joined(),
                    value: `${detailedShortDate(member.joinedTimestamp!)}`,
                    inline: true
                },
                {
                    name: locale.embed.fields.left(),
                    value: `${detailedShortDate(Date.now())}`,
                    inline: true
                }
            )
            .setFooter({
                text: locale.embed.footer.text(),
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
    member: GuildMember,
    logChannel: GuildBasedChannel | undefined
) =>
    !guildMemberRemove.enabled ||
    guildMemberRemove.channelId === '' ||
    (guildMemberRemove.ignoreBots && member.user.bot) ||
    !canSendMessage(logChannel);
