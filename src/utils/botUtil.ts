import { IGuild, INotifications } from '../models';
import { Guild } from 'discord.js';

export const checkBotPermission = (guild: Guild, permissionFlag: bigint) => {
    return guild.members.me!.permissions.has(permissionFlag);
};

export const checkNotificationsSubModule = (guildSettings: IGuild, smn: keyof INotifications) => {
    const notifications: INotifications = guildSettings.modules.notifications;

    const subModule = notifications[smn];

    if (typeof subModule === 'boolean') {
        return false;
    }

    return notifications.enabled && subModule.enabled;
};

export const checkTemporaryVoiceModule = (guildSettings: IGuild) => {
    return guildSettings.modules.temporaryVoice.enabled;
};

export const timestampToDate = (timestamp: number): number => {
    return Math.floor(timestamp / 1000);
};
