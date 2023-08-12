import { IGuild, INotifications } from '../models';
import { CustomErrors } from './errors';

export const isEventManagementModuleEnabled = (
    guildSettings: IGuild,
    throwError: boolean = false
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

export const isNotifSMEnabled = (module: INotifications, smn: keyof INotifications) => {
    const subModule = module[smn];

    if (typeof subModule === 'boolean') {
        return false;
    }

    return module.enabled && subModule.enabled;
};

export const isQOtDModuleEnabled = (
    guildSettings: IGuild,
    throwError: boolean = false
): boolean => {
    if (guildSettings.modules.qotd.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.QOtDeDisabledError;
        }
        return false;
    }
};

export const isTemporaryVoiceModuleEnabled = (
    guildSettings: IGuild,
    throwError: boolean = false
): boolean => {
    if (guildSettings.modules.temporaryVoice.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.TempVoiceDisabledError;
        }
        return false;
    }
};

export const isTwitchLiveModuleEnabled = (
    guildSettings: IGuild,
    throwError: boolean = false
): boolean => {
    if (guildSettings.modules.twitchLive.enabled) {
        return true;
    } else {
        if (throwError) {
            throw CustomErrors.TwitchDisabledError;
        }
        return false;
    }
};
