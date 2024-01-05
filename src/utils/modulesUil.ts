import { IGuild, ITVMUserSettings } from 'adroi.d.ea';
import { CustomErrors } from './errors';
import { GuildMember } from 'discord.js';
import guildService from '../services/guildService';

/**
 * Checks if the event management module is enabled for the given guild.
 * @param guildSettings - The guild settings object.
 * @param throwError - Optional parameter to indicate whether to throw an error if the module is disabled (default: false).
 * @returns Returns true if the event management module is enabled, otherwise false.
 */
//TODO: Add back in when event management module is added
// export const isEventManagementModuleEnabled = (
//     guildSettings: IGuild,
//     throwError = false
// ): boolean => {
//     if (guildSettings.modules.eventManagement.enabled) {
//         return true;
//     } else {
//         if (throwError) {
//             throw CustomErrors.ScheduledEventDisabledError;
//         }
//         return false;
//     }
// };

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
