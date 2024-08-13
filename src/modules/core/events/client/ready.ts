import { ActivityType, Client, Events } from 'discord.js';
import Logger from '../../../../utils/logger';
import { regCMD } from '../../../../deploy-commands';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        Logger.client(
            `🚀 Bot ${client.user?.username} up and running for ${client.guilds.cache.size} guilds!`
        );
        client.user?.setPresence({
            activities: [{ name: 'adan_ea sur twitch !', type: ActivityType.Watching }],
            status: 'dnd'
        });
        if (process.env.NODE_ENV === 'PRODUCTION') regCMD(client.user?.id!);
    }
};
