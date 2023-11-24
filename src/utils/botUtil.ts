import { Guild } from 'discord.js';

export const hasBotPermission = (guild: Guild, permissionsFlag: bigint[]) => {
    return guild.members.me!.permissions.has(permissionsFlag);
};

export const timestampToDate = (timestamp: number): number => {
    return Math.floor(timestamp / 1000);
};
