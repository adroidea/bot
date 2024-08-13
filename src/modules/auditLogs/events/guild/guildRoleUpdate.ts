import {
    APIEmbedField,
    AuditLogEvent,
    Client,
    EmbedBuilder,
    Events,
    GuildAuditLogs,
    Role
} from 'discord.js';
import { Emojis } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../i18n/i18n-types';
import { addAuthor } from '../../../../utils/embeds.util';
import { addComparedPermissionsNames } from '../../../../utils/modules.uil';
import { getOneGuildCache } from '../../../core/tasks/createCache.cron';
import { loadLL } from '../../../../i18n/formatters';

export default {
    name: Events.GuildRoleUpdate,
    async execute(client: Client, oldRole: Role, newRole: Role) {
        if (hasOnlyPositionChanged(oldRole, newRole)) return;

        const guild = getOneGuildCache(oldRole.guild.id);
        if (!guild) return;

        const { guildRoleUpdate } = guild.modules.auditLogs;
        if (shouldIgnoreRoleUpdate(guildRoleUpdate)) return;

        const logChannel = client.channels.cache.get(guildRoleUpdate.channelId);
        if (!logChannel?.isTextBased()) return;

        const fetchedLogs = await oldRole.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleUpdate
        });

        const LL = await loadLL(guild.locale);
        const locale = LL.modules.auditLogs.guildRoleUpdate;

        const embed = createEmbed(newRole, fetchedLogs, LL);

        addFieldIfChanged(
            locale.embed.fields.roleChanged.old(),
            locale.embed.fields.roleChanged.new(),
            oldRole.name,
            newRole.name,
            embed
        );
        addFieldIfChanged(
            locale.embed.fields.colorChanged.old(),
            locale.embed.fields.colorChanged.new(),
            oldRole.hexColor,
            newRole.hexColor,
            embed
        );

        const fields: APIEmbedField[] = [];

        const booleanValues: Record<string, { name: string; emoji: string }> = {
            mentionable: { name: locale.embed.fields.mentionable(), emoji: Emojis.mention },
            hoist: { name: locale.embed.fields.hoist(), emoji: Emojis.roles },
            managed: { name: locale.embed.fields.managed(), emoji: Emojis.link }
        };

        Object.entries(booleanValues).forEach(([fieldName, value]) => {
            const key = fieldName as keyof Role;
            addBooleanIfChanged(oldRole[key] as boolean, newRole[key] as boolean, value, fields);
        });

        const fieldsWithEmpty = addEmptyFields(fields);
        embed.addFields(fieldsWithEmpty);

        addComparedPermissionsNames(oldRole.permissions, newRole.permissions, embed);

        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleUpdate = (guildRoleCreate: IAuditLogsModule['guildRoleCreate']): boolean =>
    !guildRoleCreate.enabled || guildRoleCreate.channelId === '';

const hasOnlyPositionChanged = (oldRole: Role, newRole: Role): boolean =>
    oldRole.position !== newRole.position &&
    oldRole.name === newRole.name &&
    oldRole.color === newRole.color &&
    oldRole.hoist === newRole.hoist &&
    oldRole.permissions.equals(newRole.permissions) &&
    oldRole.managed === newRole.managed &&
    oldRole.mentionable === newRole.mentionable &&
    oldRole.icon === newRole.icon &&
    oldRole.unicodeEmoji === newRole.unicodeEmoji;

function createEmbed(newRole: Role, fetchedLogs: GuildAuditLogs, LL: TranslationFunctions) {
    const locale = LL.modules.auditLogs.guildRoleUpdate.embed;
    const embed = new EmbedBuilder()
        .setTitle(locale.title({ roleName: newRole.name }))
        .setColor(newRole.color)
        .setFooter({ text: locale.footer() })
        .setTimestamp();

    const executor = fetchedLogs.entries.first()?.executor;
    addAuthor(embed, executor);

    return embed;
}

function addFieldIfChanged(
    oldName: string,
    newName: string,
    oldValue: string,
    newValue: string,
    embed: EmbedBuilder
) {
    if (oldValue !== newValue) {
        embed.addFields(
            {
                name: oldName,
                value: `${oldValue}`,
                inline: true
            },
            {
                name: newName,
                value: `${newValue}`,
                inline: true
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: true
            }
        );
    }
}

function addBooleanIfChanged(
    oldValue: boolean,
    newValue: boolean,
    content: { name: string; emoji: string },
    fields: APIEmbedField[]
) {
    if (oldValue !== newValue) {
        const value = oldValue ? Emojis.aCross : Emojis.aCheck;

        fields.push({
            name: `${content.emoji} ${content.name}`,
            value,
            inline: true
        });
    }
}

function addEmptyFields(fields: APIEmbedField[]) {
    const fieldsWithEmpty: APIEmbedField[] = [];
    for (let i = 0; i < fields.length; i++) {
        fieldsWithEmpty.push(fields[i]);

        if (i < fields.length - 1 && (i + 1) % 3 === 0) {
            fieldsWithEmpty.push({ name: '\u200B', value: '\u200B', inline: true });
        }
    }

    if (fieldsWithEmpty.length % 3 !== 0) {
        const additionalEmptyFields = 3 - (fieldsWithEmpty.length % 3);

        for (let i = 0; i < additionalEmptyFields; i++) {
            fieldsWithEmpty.push({ name: '\u200B', value: '\u200B', inline: true });
        }
    }

    return fieldsWithEmpty;
}
