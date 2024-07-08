import { AuditLogEvent, Client, EmbedBuilder, Events, GuildBasedChannel, Role } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embeds.util';
import { addPermissionsNames } from '../../../../utils/modules.uil';
import { canSendMessage } from '../../../../utils/bot.util';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.GuildRoleDelete,
    async execute(client: Client, role: Role) {
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete
        });

        const {
            locale: localeLL,
            modules: {
                auditLogs: { guildRoleDelete }
            }
        } = await guildService.getOrCreateGuild(role.guild);

        const logChannel = client.guilds.cache
            .get(role.guild.id)
            ?.channels.cache.get(guildRoleDelete.channelId);
        if (!logChannel?.isTextBased()) return;
        if (shouldIgnoreRoleDelete(guildRoleDelete, logChannel)) return;

        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.guildRoleDelete;
        const embed = new EmbedBuilder()
            .setTitle(locale.embed.title({ roleName: role.name }))
            .setFooter({
                text: locale.embed.footer.text()
            })
            .setTimestamp();

        const executor = fetchedLogs.entries.first()?.executor;
        addAuthor(embed, executor);

        addPermissionsNames(role.permissions, embed, LL);

        if (role.color) embed.setColor(role.color);
        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleDelete = (
    guildRoleDelete: IAuditLogsModule['guildRoleDelete'],
    logChannel: GuildBasedChannel | undefined
) => !guildRoleDelete.enabled || guildRoleDelete.channelId === '' || !canSendMessage(logChannel);
