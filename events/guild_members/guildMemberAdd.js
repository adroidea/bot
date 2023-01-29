const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    /**
     * Event triggered when a user joins the guild. When triggered, sends a welcome message in the public log channel.
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {GuildMember} member - Represents a member of a guild on Discord.
     */
    async execute(client, member) {
        const fetchGuild = await client.getGuild(member.guild);

        const logChannel = client.channels.cache.get(
            fetchGuild.publicLogChannel
        );
        if (logChannel === undefined || logChannel === null) return;

        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.id}`,
                iconURL: member.user.avatarURL()
            })
            .setThumbnail(member.user.avatarURL())
            .setTitle(
                `<a:pikaHi:960872476718551070> Bienvenue sur le serveur ${member.user.tag} !`
            )
            .setDescription(
                `Bonjour à toi ! Surtout n'oublie pas, le bon sens est une règle, veille à respecter ce qui devrait être évident !
             Nous souhaitons que ton expérience parmi nous soit aussi plaisante que possible, et nous nous y emploierons constamment.`
            )
            .addFields(
                {
                    name: '❄ Création :',
                    value: `<t:${parseInt(
                        member.user.createdTimestamp / 1000
                    )}:R>`,
                    inline: true
                },
                {
                    name: '❄ Nombre de membres :',
                    value: `${member.guild.memberCount}`,
                    inline: true
                }
            )
            .setFooter({
                text: "T'es vraiment bg tu sais ?",
                iconURL: member.user.avatarURL()
            })
            .setTimestamp()
            .setColor(randomColor);
        await logChannel.send({ embeds: [embed] });
    }
};
