module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Bot up and running !`);

        const devGuild = await client.guilds.cache.get('605053128148254724');
        await devGuild.commands.set(client.commands.map(cmd => cmd));
    }
};
