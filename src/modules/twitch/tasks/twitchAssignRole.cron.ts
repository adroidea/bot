import { Guild, GuildMember, Role } from 'discord.js';
import { ITMStreamersData } from 'adroi.d.ea';
import { client } from '../../../index';
import cron from 'node-cron';
import { getGuildsCache } from '../../core/tasks/createCache.cron';
import logger from '../../../utils/logger';

export default function (): cron.ScheduledTask {
    return cron.schedule('*/5 * * * *', () => {
        const guildsCache = getGuildsCache();
        for (const guild of guildsCache) {
            if(!guild.modules.twitch.enabled) continue;
            const guildData: Guild = client.guilds.cache.get(guild.id);
            if (!guildData) continue;

            const { enabled, streamers, streamingRoleId } = guild.modules.twitch.autoRoles;
            if (!enabled) continue;

            if (streamers.length > 0 && streamingRoleId !== '') {
                toggleStreamersRole(guildData, streamers, streamingRoleId);
            }
        }
    });
}

/**
 * Toggles the role of streamers based on their streaming status.
 * @param guild The guild where the streamers are members.
 * @param streamers An array of streamer data.
 * @param streamingRoleId The ID of the role to assign to streamers when they are streaming.
 */
const toggleStreamersRole = async (
    guild: Guild,
    streamers: ITMStreamersData[],
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
                await fetch(`https://decapi.me/twitch/uptime/${streamer.streamer}`)
            ).text();
            if (response === `${streamer.streamer} is offline`) {
                if (hasRole) {
                    await member.roles.remove(role);
                }
            } else if (
                response === '[Error from Twitch API] 400: Bad Request - Malformed query params.'
            ) {
                return logger.warn(
                    `Error from Twitch API for ${streamer.streamer} in ${guild.name} (${guild.id})`
                );
            } else if (!hasRole) {
                await member.roles.add(role);
            }
        } catch (err: any) {
            logger.error('Error in toggleStreamersRole => twitchAssignRole.cron.js', err);
        }
    }
};
