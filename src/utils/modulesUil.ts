import { EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';
import { IGuild, ITVMUserSettings } from 'adroi.d.ea';
import { CustomErrors } from './errors';
import { Emojis } from './consts';
import { TranslationFunctions } from '../locales/i18n-types';
import guildService from '../services/guild.service';

/**
 * Checks if the QOtD module is enabled in the guild settings.
 * @param guildSettings - The guild settings object.
 * @param throwError - Optional. Specifies whether to throw an error if the module is disabled. Default is false.
 * @returns A boolean indicating whether the QOtD module is enabled.
 * @throws {CustomErrors.QOtDeDisabledError} - If throwError is true and the module is disabled.
 */
export const isQOtDModuleEnabled = (guildSettings: IGuild, throwError = false): boolean => {
    if (guildSettings.modules.qotd.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.QOtDeDisabledError;
        }
        return false;
    }
};

/**
 * Checks if the temporary voice module is enabled for a guild.
 * @param guildSettings - The guild settings object.
 * @param throwError - Optional. Specifies whether to throw an error if the module is disabled. Default is false.
 * @returns A boolean indicating whether the temporary voice module is enabled.
 */
export const isTempVoiceModuleEnabled = (guildSettings: IGuild, throwError = false): boolean => {
    if (guildSettings.modules.tempVoice.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.TempVoiceDisabledError;
        }
        return false;
    }
};

/**
 * Retrieves or creates user settings for a given user ID and guild settings.
 * If the user settings do not exist, it creates default settings and updates the guild settings.
 * @param userId - The ID of the user.
 * @param guildSettings - The guild settings object.
 * @returns The user settings object.
 */
export const getorCreateUserSettings = async (
    member: GuildMember,
    guildSettings: IGuild
): Promise<ITVMUserSettings> => {
    const { id, guild } = member;
    let userSettings = guildSettings.modules.tempVoice.userSettings[id];

    if (!userSettings) {
        userSettings = {
            trustedUsers: [],
            blockedUsers: [],
            isPrivate: false
        };

        const updateObject: Record<string, any> = {};
        updateObject[`modules.tempVoice.userSettings.${id}.trustedUsers`] =
            userSettings.trustedUsers;
        updateObject[`modules.tempVoice.userSettings.${id}.blockedUsers`] =
            userSettings.blockedUsers;
        updateObject[`modules.tempVoice.userSettings.${id}.isPrivate`] = userSettings.isPrivate;

        await guildService.updateGuild(guild, updateObject);
    }

    return userSettings;
};

const categories = (LL: TranslationFunctions) => {
    const locale = LL.modules.auditLogs.categories;
    return {
        [locale.general()]: [
            'ManageChannels',
            'ManageGuild',
            'ViewAuditLog',
            'ViewChannel',
            'ViewGuildInsights',
            'ManageRoles',
            'ManageWebhooks',
            'ManageEmojisAndStickers',
            'ManageGuildExpressions'
        ],
        [locale.membership()]: [
            'CreateInstantInvite',
            'KickMembers',
            'BanMembers',
            'ChangeNickname',
            'ManageNicknames',
            'ModerateMembers'
        ],
        [locale.events()]: ['ManageEvents'],
        [locale.textChannel()]: [
            'AddReactions',
            'SendMessages',
            'SendTTSMessages',
            'ManageMessages',
            'EmbedLinks',
            'AttachFiles',
            'ReadMessageHistory',
            'MentionEveryone',
            'UseExternalEmojis',
            'UseApplicationCommands',
            'ManageThreads',
            'CreatePublicThreads',
            'CreatePrivateThreads',
            'UseExternalStickers',
            'SendMessagesInThreads',
            'SendVoiceMessages'
        ],
        [locale.voiceChannel()]: [
            'PrioritySpeaker',
            'Stream',
            'Connect',
            'Speak',
            'MuteMembers',
            'DeafenMembers',
            'MoveMembers',
            'UseVAD',
            'UseEmbeddedActivities',
            'UseSoundboard',
            'UseExternalSounds'
        ],
        [locale.stageChannel()]: ['RequestToSpeak'],
        [locale.advanced()]: ['Administrator']
    };
};
export const addPermissionsNames = (
    permissions: PermissionsBitField,
    embed: EmbedBuilder,
    LL: TranslationFunctions
) => {
    const permissionNames: string[] = permissions.toArray();

    const categorizedPermissions: Record<string, string[]> = {};

    for (const [category, perms] of Object.entries(categories(LL))) {
        let deniedCount = 0;
        const categorizedPerms: string[] = [];

        perms.forEach(perm => {
            const permWithSpaces = perm.replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, '$1$3 $2$4');

            if (permissionNames.includes(perm)) {
                categorizedPerms.push(`✅ ${permWithSpaces}`);
            } else {
                deniedCount++;
            }
        });

        if (deniedCount > 0) {
            categorizedPerms.push(
                LL.modules.auditLogs.events.guildRoleCreate.embed.unassigned({ deniedCount })
            );
        }

        categorizedPermissions[category] = categorizedPerms;
    }

    addPermissionFields(categorizedPermissions, embed);
};

export const addComparedPermissionsNames = (
    oldPermissions: PermissionsBitField,
    newPermissions: PermissionsBitField,
    embed: EmbedBuilder,
    LL: TranslationFunctions
) => {
    const permissionNames1: string[] = oldPermissions.toArray();
    const permissionNames2: string[] = newPermissions.toArray();

    const categorizedPermissions: Record<string, string[]> = {};

    for (const [category, perms] of Object.entries(categories(LL))) {
        let deniedCount = 0;
        const categorizedPerms: string[] = [];

        perms.forEach(perm => {
            const permWithSpaces = perm.replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, '$1$3 $2$4');

            if (permissionNames1.includes(perm) && permissionNames2.includes(perm)) {
                categorizedPerms.push(`${Emojis.check} ${permWithSpaces}`);
            } else if (permissionNames1.includes(perm)) {
                categorizedPerms.push(`${Emojis.aCross} ${permWithSpaces}`);
            } else if (permissionNames2.includes(perm)) {
                categorizedPerms.push(`${Emojis.aCheck} ${permWithSpaces}`);
            } else {
                deniedCount++;
            }
        });

        if (deniedCount > 0) {
            categorizedPerms.push(
                LL.modules.auditLogs.events.guildRoleUpdate.embed.unassigned({ deniedCount })
            );
        }

        categorizedPermissions[category] = categorizedPerms;
    }

    addPermissionFields(categorizedPermissions, embed);
};

function addPermissionFields(
    categorizedPermissions: Record<string, string[]>,
    embed: EmbedBuilder
) {
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
