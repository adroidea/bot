import { IGuild, INotifications } from "../models";
import { RGBTuple } from "discord.js";

export function getRandomRGB(): RGBTuple {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return [r, g, b];
}

export default function checkBotPermission(guild: any, permissionFlag: bigint) {
  // FIXME: always returns true
  return guild.members.me.permissions.has(permissionFlag);
}

export function checkNotificationsSubModule(
  guildSettings: IGuild,
  smn: keyof INotifications
) {
  const notifications: INotifications = guildSettings.modules.notifications;

  const subModule = notifications[smn as keyof INotifications];

  if (typeof subModule === "boolean") {
    return false;
  }

  return notifications.enabled && subModule.enabled;
}

export function checkTemporaryVoiceModule(guildSettings: IGuild) {
  return guildSettings.modules.temporaryVoice.enabled;
}
