import { ActivityType, Client, Events } from 'discord.js';
import Logger from '../../../../utils/logger';
import { regCMD } from '../../../../deploy-commands';

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        Logger.client(`🚀 Bot ${client.user?.username} up and running !`);
        client.user?.setPresence({
            activities: [{ name: 'adan_ea sur twitch !', type: ActivityType.Watching }],
            status: 'dnd'
        });
        if (process.env.NODE_ENV === 'production') {
            regCMD(client.user?.id!);
        }
    }
};
