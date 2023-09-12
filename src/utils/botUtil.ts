import { Guild } from 'discord.js';

export const checkBotPermission = (guild: Guild, permissionFlag: bigint[]) => {
    return guild.members.me!.permissions.has(permissionFlag);
};

export const timestampToDate = (timestamp: number): number => {
    return Math.floor(timestamp / 1000);
};
