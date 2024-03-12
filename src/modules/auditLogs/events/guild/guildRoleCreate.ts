import { AuditLogEvent, Client, EmbedBuilder, Events, GuildBasedChannel, Role } from 'discord.js';
import { IAuditLogsModule } from 'adroi.d.ea';
import { Locales } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embedsUtil';
import { addPermissionsNames } from '../../../../utils/modulesUil';
import { canSendMessage } from '../../../../utils/botUtil';
import guildService from '../../../../services/guild.service';
import { loadLL } from '../../../core/events/client/interactionCreate';

export default {
    name: Events.GuildRoleCreate,
    async execute(client: Client, role: Role) {
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate
        });

        const {
            locale: localeLL,
            modules: {
                auditLogs: { guildRoleCreate }
            }
        } = await guildService.getOrCreateGuild(role.guild);

        const logChannel = client.guilds.cache
            .get(role.guild.id)
            ?.channels.cache.get(guildRoleCreate.channelId);
        if (!logChannel?.isTextBased()) return;

        if (shouldIgnoreRoleCreate(guildRoleCreate, logChannel)) return;
        const LL = await loadLL((localeLL as Locales) ?? 'en');
        const locale = LL.modules.auditLogs.events.guildRoleCreate;

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

const shouldIgnoreRoleCreate = (
    guildRoleCreate: IAuditLogsModule['guildRoleCreate'],
    logChannel: GuildBasedChannel | undefined
) => !guildRoleCreate.enabled || guildRoleCreate.channelId === '' || !canSendMessage(logChannel);
