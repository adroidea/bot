import { ChannelType, Guild, GuildBasedChannel, PermissionsBitField } from 'discord.js';
import { Emojis } from './consts';
import { client } from '../..';

export const hasBotPermission = (guild: Guild, permissionsFlag: bigint[]) => {
    const channels = guild.channels.cache.filter(
        channel =>
            channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement
    );

    const canSendMessages = channels.some(channel => canSendMessage(channel));

    if (!canSendMessages) {
        warnOwnerNoPermissions(guild, permissionsFlag);
    }
    return guild.members.me!.permissions.has(permissionsFlag);
};

export const warnOwnerNoPermissions = (guild: Guild, permissions: bigint[]) => {
    if (client.warnedOwner.has(guild.id)) return;
    guild.fetchOwner().then(owner => {
        client.warnedOwner.set(guild.id, owner.id);
        owner.send(
            `Hello ! Il se passe des choses sur le serveur **${
                guild.name
            }** mais je n'ai pas les permissions nécessaires pour envoyer des messages. Tu pourrais s'il te plaît me donner :\n${listBotPermissions(
                guild,
                permissions
            )}`
        );
    });
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
        .has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]);
};

/**
 * Checks if the bot has each permission in the provided list and returns a formatted string.
 * @param guild - The guild to check permissions in.
 * @param permissions - An array of permission flags to check.
 * @returns A string with each permission and its status (allowed or denied).
 */
export const listBotPermissions = (guild: Guild, permissions: bigint[]): string => {
    let result = '';

    permissions.forEach(perm => {
        const permName = getPermissionName(perm);
        const permWithSpaces = permName.replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, '$1$3 $2$4');

        if (hasBotPermission(guild, [perm])) {
            result += `> ${Emojis.check} ${permWithSpaces}\n`;
        } else {
            result += `> ${Emojis.cross} ${permWithSpaces}\n`;
        }
    });

    return result;
};

/**
 * Retrieves the permission name from a permission flag.
 * @param perm - The permission flag as a bigint.
 * @returns The human-readable name of the permission.
 */
const getPermissionName = (perm: bigint): string => {
    for (const [key, value] of Object.entries(PermissionsBitField.Flags)) {
        if (value === perm) {
            return key;
        }
    }
    return perm.toString();
};
