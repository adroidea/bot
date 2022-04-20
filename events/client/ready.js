module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Bot ${client.user.tag} up and running !`);
        const devGuild = await client.guilds.cache.get('814621177770541076');
        await devGuild.commands.set(client.commands.map(cmd => cmd));

        client.user.setPresence({ activities: [{ name: 'adan_ea sur twitch !', type:'WATCHING' }], status: 'dnd' });
    }
};
