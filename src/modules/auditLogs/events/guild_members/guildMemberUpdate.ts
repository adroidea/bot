import { Client, EmbedBuilder, Events, GuildBasedChannel, GuildMember } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embeds.util';
import { canSendMessage } from '../../../../utils/bot.util';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.GuildMemberUpdate,
    async execute(client: Client, oldMember: GuildMember, newMember: GuildMember) {
        if (oldMember.nickname === newMember.nickname) return;

        const {
            locale: localeLL,
            modules: {
                auditLogs: { guildMemberUpdate }
            }
        } = await guildService.getOrCreateGuild(newMember.guild);

        const logChannel = client.guilds.cache
            .get(newMember.guild.id)
            ?.channels.cache.get(guildMemberUpdate.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreMemberUpdate(guildMemberUpdate, oldMember, logChannel)) return;

        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.guildMemberUpdate;

        const embed = new EmbedBuilder()
            .setDescription(locale.embed.description({ username: newMember.id }))
            .addFields([
                {
                    name: locale.embed.fields.nickname.old(),
                    value: oldMember.nickname ?? oldMember.user.username,
                    inline: false
                },
                {
                    name: locale.embed.fields.nickname.new(),
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
    !canSendMessage(logChannel) ||
    guildMemberUpdate.ignoredUsers.includes(member.id);
