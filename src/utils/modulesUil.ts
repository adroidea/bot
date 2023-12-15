import { IGuild, INotifications } from '../models';
import { CustomErrors } from './errors';
import { GuildMember } from 'discord.js';
import { ITempVoiceUserSettings } from '../modules/tempVoice/models/temporaryVoiceModel';
import guildService from '../services/guildService';

/**
 * Checks if the event management module is enabled for the given guild.
 * @param guildSettings - The guild settings object.
 * @param throwError - Optional parameter to indicate whether to throw an error if the module is disabled (default: false).
 * @returns Returns true if the event management module is enabled, otherwise false.
 */
export const isEventManagementModuleEnabled = (
    guildSettings: IGuild,
    throwError = false
): boolean => {
    if (guildSettings.modules.eventManagement.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.ScheduledEventDisabledError;
        }
        return false;
    }
};

/**
 * Checks if a specific sub-module of the notifications module is enabled.
 * @param module - The notifications module object.
 * @param smn - The name of the sub-module to check.
 * @returns A boolean indicating whether the sub-module is enabled or not.
 */
export const isNotifSMEnabled = (module: INotifications, smn: keyof INotifications) => {
    const subModule = module[smn];

    if (typeof subModule === 'boolean') {
        return false;
    }

    return module.enabled && subModule.enabled;
};

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
    if (guildSettings.modules.temporaryVoice.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.TempVoiceDisabledError;
        }
        return false;
    }
};

/**
 * Checks if the Twitch Live module is enabled for the given guild.
 * @param guildSettings - The guild settings object.
 * @param throwError - Optional. Specifies whether to throw an error if the module is disabled. Default is false.
 * @returns A boolean indicating whether the Twitch Live module is enabled.
 */
export const isTwitchLiveModuleEnabled = (guildSettings: IGuild, throwError = false): boolean => {
    if (guildSettings.modules.twitchLive.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.TwitchDisabledError;
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
): Promise<ITempVoiceUserSettings> => {
    const { id, guild } = member;
    let userSettings = guildSettings.modules.temporaryVoice.userSettings[id];

    if (!userSettings) {
        userSettings = {
            trustedUsers: [],
            blockedUsers: [],
            isPublic: true
        };

        const updateObject: Record<string, any> = {};
        updateObject[`modules.temporaryVoice.userSettings.${id}.trustedUsers`] =
            userSettings.trustedUsers;
        updateObject[`modules.temporaryVoice.userSettings.${id}.blockedUsers`] =
            userSettings.blockedUsers;
        updateObject[`modules.temporaryVoice.userSettings.${id}.isPublic`] = userSettings.isPublic;

        await guildService.updateGuild(guild, updateObject);
    }

    return userSettings;
};
