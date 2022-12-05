const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    /**
     * Event triggered when a user leaves the guild. When triggered, sends a goodbye message in the public log channel.
     * @param {ClientOptions} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} member - Represents a member of a guild on Discord.
     */
    async execute(client, member) {
        const fetchGuild = await client.getGuild(member.guild);
        const logChannel = client.channels.cache.get(
            fetchGuild.publicLogChannel
        );
        if (logChannel === undefined || logChannel === null) return;
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${member.user.id}`,
                iconURL: member.user.avatarURL()
            })
            .setThumbnail(
                'https://cdn.discordapp.com/attachments/779901444408606730/918202331743539200/unknown.png'
            )
            .setTitle(`${member.user.tag} nous a quitté!`)
            .setDescription(`Weaklings Die. Big Deal.`)
            .addFields(
                {
                    name: '❄ Création :',
                    value: `<t:${parseInt(
                        member.user.createdTimestamp / 1000
                    )}:R>`,
                    inline: true
                },
                {
                    name: '❄ Rejoint :',
                    value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '❄ Nombre de membres :',
                    value: `${member.guild.memberCount}`,
                    inline: false
                }
            )
            .setFooter({
                text: 'So long partner.',
                iconURL: member.user.avatarURL()
            })
            .setTimestamp()
            .setColor(randomColor);
        await logChannel.send({ embeds: [embed] });
    }
};
