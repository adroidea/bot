import { Guild, GuildBasedChannel, PermissionsBitField } from 'discord.js';

export const hasBotPermission = (guild: Guild, permissionsFlag: bigint[]) => {
    return guild.members.me!.permissions.has(permissionsFlag);
};

export const timestampToDate = (timestamp: number): number => {
    return Math.floor(timestamp / 1000);
};

/**
 * Returns the date in the relative format.
 * @param timestamp - The timestamp to convert.
 * @returns One year ago.
 */
export const relativeDate = (timestamp: number): string => {
    return `<t:${timestampToDate(timestamp)}:R>`;
};

/**
 * Returns the date in the short format.
 * @param timestamp - The timestamp to convert.
 * @returns 15/01/2021.
 */
export const shortDate = (timestamp: number): string => {
    return `<t:${timestampToDate(timestamp)}:d>`;
};

/**
 * Returns the date in the long format.
 * @param timestamp - The timestamp to convert.
 * @returns January 15, 2021.
 */
export const longDate = (timestamp: number): string => {
    return `<t:${timestampToDate(timestamp)}:D>`;
};

/**
 * Returns the date in the long date with short time format.
 * @param timestamp - The timestamp to convert.
 * @returns 15/01/2021 17:00.
 */
export const longDateTime = (timestamp: number): string => {
    return `<t:${timestampToDate(timestamp)}:f>`;
};

/**
 * Returns the date in the detailed format.
 * @param timestamp - The timestamp to convert.
 * @returns 15/01/2021 (One year ago).
 */
export const detailedShortDate = (timestamp: number): string => {
    return `${shortDate(timestamp)} (${relativeDate(timestamp)})`;
};

export const canSendMessage = (channel: GuildBasedChannel | undefined) => {
    return channel
        ?.permissionsFor(channel.guild.members.me!)!
        .has([
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.SendMessagesInThreads
        ]);
};
