module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        client.createGuild(guild);
    }
};
