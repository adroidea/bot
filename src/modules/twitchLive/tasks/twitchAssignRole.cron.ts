import { Guild, GuildMember, Role } from 'discord.js';
import { GuildModel, IStreamersData } from '../../../models';
import { client } from '../../../index';
import cron from 'node-cron';
import logger from '../../../utils/logger';

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is not defined');
}

export const randomizeArray = (array: string[]): string => {
    const randomNumber = Math.floor(Math.random() * array.length);
    return array[randomNumber];
};

export default function (): cron.ScheduledTask {
    return cron.schedule('* * * * *', () => {
        GuildModel.find()
            .exec()
            .then(guilds => {
                for (const guild of guilds) {
                    const guildData: Guild = client.guilds.cache.get(guild.id);
                    if (!guildData) continue;

                    const { twitchLive } = guild.modules;
                    const { enabled, streamers, streamingRoleId } = twitchLive;
                    if (!enabled) continue;

                    if (streamers && streamingRoleId) {
                        toggleStreamersRole(guildData, streamers, streamingRoleId);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching guilds:', error);
            });
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

        const hasRole: boolean = member.roles.cache.some(role => role.id === streamingRoleId);
        try {
            const response: Promise<string> = (
                await fetch(`https://api.crunchprank.net/twitch/uptime/${streamer.streamer}`)
            ).text();

            if ((await response) === `${streamer.streamer} is offline`) {
                if (hasRole) {
                    member.roles.remove(role);
                }
            } else if (!hasRole) {
                member.roles.add(role);
            }
        } catch (err: any) {
            logger.error(
                'Error fetching api.crunchprank.net in toggleStreamersRole => twitchAlert.cron.js',
                err
            );
        }
    }
};
