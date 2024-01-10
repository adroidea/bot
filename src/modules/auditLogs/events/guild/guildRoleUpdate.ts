import { APIEmbedField, AuditLogEvent, Client, EmbedBuilder, Events, Role } from 'discord.js';
import { Emojis } from '../../../../utils/consts';
import { IAuditLogsModule } from 'adroi.d.ea';
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

        const embed = new EmbedBuilder()
            .setTitle(`Rôle __${newRole.name}__ mis à jour`)
            .setColor(newRole.color)
            .setFooter({ text: 'Rôle modifié' })
            .setTimestamp();

        const executor = fetchedLogs.entries.first()?.executor;
        if (executor)
            embed.setAuthor({
                name: `${executor.username} (${executor.id})`,
                iconURL: executor.displayAvatarURL()!
            });

        if (oldRole.name !== newRole.name)
            embed.addFields(
                {
                    name: 'Ancien nom',
                    value: `${oldRole.name}`,
                    inline: true
                },
                {
                    name: 'Nouveau nom',
                    value: `${newRole.name}`,
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                }
            );

        if (oldRole.color !== newRole.color)
            embed.addFields(
                {
                    name: 'Ancienne couleur',
                    value: `${oldRole.hexColor}`,
                    inline: true
                },
                {
                    name: 'Nouvelle couleur',
                    value: `${newRole.hexColor}`,
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                }
            );

        const fields: APIEmbedField[] = [];

        if (oldRole.mentionable !== newRole.mentionable) {
            const value =
                oldRole.mentionable === true && newRole.mentionable === false
                    ? Emojis.aCross
                    : Emojis.aCheck;

            fields.push({
                name: `${Emojis.mention} Mentionnable`,
                value: value,
                inline: true
            });
        }

        if (oldRole.hoist !== newRole.hoist) {
            const value =
                oldRole.hoist === true && newRole.hoist === false ? Emojis.aCross : Emojis.aCheck;

            fields.push({
                name: ` ${Emojis.roles} Afficher séparément`,
                value: value,
                inline: true
            });
        }

        if (oldRole.managed !== newRole.managed) {
            const value =
                oldRole.managed === true && newRole.managed === false
                    ? Emojis.aCross
                    : Emojis.aCheck;

            fields.push({
                name: `${Emojis.link} Géré par discord`,
                value: value,
                inline: true
            });
        }

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

        if (fieldsWithEmpty.length > 0) embed.addFields(fieldsWithEmpty);

        if (newRole.permissions.bitfield !== oldRole.permissions.bitfield)
            for (const [category, perms] of Object.entries(categorizedPermissions)) {
                if (perms.length > 0)
                    embed.addFields({
                        name: category,
                        value: perms.join('\n'),
                        inline: true
                    });
            }

        await logChannel.send({ embeds: [embed] });
    }
};

const shouldIgnoreRoleUpdate = (guildRoleCreate: IAuditLogsModule['guildRoleCreate']) =>
    !guildRoleCreate.enabled || guildRoleCreate.channelId === '';

const hasOnlyPositionChanged = (oldRole: Role, newRole: Role) =>
    oldRole.position !== newRole.position &&
    oldRole.name === newRole.name &&
    oldRole.color === newRole.color &&
    oldRole.hoist === newRole.hoist &&
    oldRole.permissions.equals(newRole.permissions) &&
    oldRole.managed === newRole.managed &&
    oldRole.mentionable === newRole.mentionable &&
    oldRole.icon === newRole.icon &&
    oldRole.unicodeEmoji === newRole.unicodeEmoji;
