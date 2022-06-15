const Logger = require('../../utils/Logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        Logger.client(`Bot ${client.user.tag} up and running !`);
        const devGuild = await client.guilds.cache.get(process.env.DISCORD_DEV_GUILD);
        await devGuild.commands.set(client.commands.map(cmd => cmd));

        client.user.setPresence({
            activities: [{ name: 'adan_ea sur twitch !', type: 'WATCHING' }],
            status: 'dnd'
        });
    }
};
