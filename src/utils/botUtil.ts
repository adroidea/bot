import { IGuild, INotifications } from '../models';
import { Guild } from 'discord.js';

export default function checkBotPermission(guild: Guild, permissionFlag: bigint) {
    return guild.members.me!.permissions.has(permissionFlag);
}

export function checkNotificationsSubModule(guildSettings: IGuild, smn: keyof INotifications) {
    const notifications: INotifications = guildSettings.modules.notifications;

    const subModule = notifications[smn];

    if (typeof subModule === 'boolean') {
        return false;
    }

    return notifications.enabled && subModule.enabled;
}

export function checkTemporaryVoiceModule(guildSettings: IGuild) {
    return guildSettings.modules.temporaryVoice.enabled;
}
