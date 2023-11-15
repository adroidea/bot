import { Guild, GuildMember, Role } from 'discord.js';
import { IStreamersData } from '../../../models';
import { client } from '../../../index';
import cron from 'node-cron';
import { guildsCache } from '../../core/tasks/createCache.cron';
import logger from '../../../utils/logger';

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is not defined');
}

export const randomizeArray = (array: string[]): string => {
    const randomNumber = Math.floor(Math.random() * array.length);
    return array[randomNumber];
};

export default function (): cron.ScheduledTask {
    return cron.schedule('* 5 * * *', () => {
        for (const guild of guildsCache) {
            const guildData: Guild = client.guilds.cache.get(guild.id);
            if (!guildData) continue;

            const { twitchLive } = guild.modules;
            const { enabled, streamers, streamingRoleId } = twitchLive;
            if (!enabled) continue;

            if (streamers && streamingRoleId) {
                toggleStreamersRole(guildData, streamers, streamingRoleId);
            }
        }
    });
}

const toggleStreamersRole = async (
    guild: Guild,
    streamers: IStreamersData[],
    streamingRoleId: string
) => {
    for (const streamer of streamers) {
        const member: GuildMember | undefined = guild.members.cache.get(streamer.memberId);
        if (!member) return;

        const role: Role | undefined = guild.roles.cache.get(streamingRoleId);
        if (!role) return;

        const hasRole: boolean = member.roles.cache.some(r => r.id === role.id);
        try {
            const response: string = await (
                // @ts-ignore
                await fetch(`https://decapi.me/twitch/uptime/${streamer.streamer}`)
            ).text();

            if (response === `${streamer.streamer} is offline`) {
                if (hasRole) {
                    member.roles.remove(role);
                }
            } else if (
                response === '[Error from Twitch API] 400: Bad Request - Malformed query params.'
            ) {
                return logger.warn(
                    `Error from Twitch API for ${streamer.streamer} in ${guild.name} (${guild.id})`
                );
            } else if (!hasRole) {
                member.roles.add(role);
            }
        } catch (err: any) {
            logger.error(
                'Error fetching decapi.me in toggleStreamersRole => twitchAlert.cron.js',
                err
            );
        }
    }
};
