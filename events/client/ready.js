const { ActivityType } = require('discord.js');
const Logger = require('../../utils/Logger');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * Send a message in the console whenever the bot is up and running
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     */
    async execute(client) {
        Logger.client(`Bot ${client.user.tag} up and running !`);
        const devGuild = await client.guilds.cache.get(
            process.env.DISCORD_DEV_GUILD
        );
        await devGuild.commands.set(client.commands.map(cmd => cmd));

        client.user.setPresence({
            activities: [{ name: 'adan_ea sur twitch !', type: ActivityType.Watching }],
            status: 'dnd'
        });
    }
};
