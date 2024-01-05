import { Guild, GuildBasedChannel, PermissionsBitField } from 'discord.js';

export const hasBotPermission = (guild: Guild, permissionsFlag: bigint[]) => {
    return guild.members.me!.permissions.has(permissionsFlag);
};

export const timestampToDate = (timestamp: number): number => {
    return Math.floor(timestamp / 1000);
};

export const canSendMessage = (channel: GuildBasedChannel | undefined) => {
    return channel
        ?.permissionsFor(channel.guild.members.me!)!
        .has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]);
};
