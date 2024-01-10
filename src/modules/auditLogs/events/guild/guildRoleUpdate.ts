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
import { addAuthor } from '../../../../utils/embedsUtil';
import { comparePermissionsNames } from '../../../../utils/modulesUil';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildRoleUpdate,
    async execute(client: Client, oldRole: Role, newRole: Role) {
        if (hasOnlyPositionChanged(oldRole, newRole)) return;

        const fetchedLogs = await oldRole.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleUpdate
        });

        const {
            modules: {
                auditLogs: { guildRoleUpdate }
            }
        } = await guildService.getOrCreateGuild(oldRole.guild);

        if (shouldIgnoreRoleUpdate(guildRoleUpdate)) return;

        const logChannel = client.channels.cache.get(guildRoleUpdate.channelId);
        if (!logChannel?.isTextBased()) return;

        const categorizedPermissions = comparePermissionsNames(
            oldRole.permissions,
            newRole.permissions
        );

        const embed = createEmbed(newRole, fetchedLogs);

        addFieldIfChanged('Ancien nom', 'Nouveau nom', oldRole.name, newRole.name, embed);
        addFieldIfChanged(
            'Ancienne couleur',
            'Nouvelle couleur',
            oldRole.hexColor,
            newRole.hexColor,
            embed
        );

        const fields: APIEmbedField[] = [];

        const booleanValues: Record<string, { name: string; emoji: string }> = {
            mentionable: { name: 'Mentionnable', emoji: Emojis.mention },
            hoist: { name: 'Afficher séparément', emoji: Emojis.roles },
            managed: { name: 'Géré par Discord', emoji: Emojis.link }
        };

        Object.entries(booleanValues).forEach(([fieldName, value]) => {
            const key = fieldName as keyof Role;
            addBooleanIfChanged(oldRole[key] as boolean, newRole[key] as boolean, value, fields);
        });

        const fieldsWithEmpty = addEmptyFields(fields);
        embed.addFields(fieldsWithEmpty);

        addPermissionFieldsIfChanged(newRole, oldRole, categorizedPermissions, embed);

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

function createEmbed(newRole: Role, fetchedLogs: GuildAuditLogs) {
    const embed = new EmbedBuilder()
        .setTitle(`Rôle __${newRole.name}__ mis à jour`)
        .setColor(newRole.color)
        .setFooter({ text: 'Rôle modifié' })
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

function addPermissionFieldsIfChanged(
    newRole: Role,
    oldRole: Role,
    categorizedPermissions: Record<string, string[]>,
    embed: EmbedBuilder
) {
    if (newRole.permissions.bitfield !== oldRole.permissions.bitfield) {
        for (const [category, perms] of Object.entries(categorizedPermissions)) {
            if (perms.length > 0) {
                embed.addFields({
                    name: category,
                    value: perms.join('\n'),
                    inline: true
                });
            }
        }
    }
}
