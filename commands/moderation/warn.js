const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
    description: '[ADMIN] Avertis un utilisateur',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'warn <idUtilisateur> <raison>',
    examples: ['warn 294916386072035328 "Spam"'],
    options: [
        {
            name: 'id',
            description: 'id utilisateur',
            type: 'USER',
            required: true
        },
        {
            name: 'raison',
            description: 'Raison du warn',
            type: 'STRING',
            required: true
        }
    ],
    /**
     * Warn a user 
     * @param {ClientOptions} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} interaction - Represents a command interaction.
     */
    async runInteraction(client, interaction) {
        const iduser = interaction.options.getMember('id');
        const reason = interaction.options.getString('raison');
        const fetchGuild = await client.getGuild(interaction.guild);
        const logChannel = client.channels.cache.get(
            fetchGuild.privateLogChannel
        );
        const agrouChannel = client.channels.cache.get('971658703155630084');
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.username}`,
                iconURL: client.user.avatarURL()
            })
            .setDescription(
                `${iduser.user.username}, tu as été Warn.\nRaison : ${reason}`
            )
            .setFooter({ text: `Warn` })
            .setColor(
                interaction.user.hexAccentColor
                    ? interaction.user.hexAccentColor
                    : '#0FF0FF'
            )
            .setTimestamp();
        try {
            await iduser.send({ embeds: [embed] });
            await logChannel.send({ embeds: [embed] });
        } catch (e) {
            await logChannel.send(
                `L'utilisateur ${iduser.user.username} n'a pas autorisé les messages privés sur ce serveur, il n'a pas pu être warn en privé, envoie dans le channel Agrou.`
            );
            await agrouChannel.send({ embeds: [embed] });
        }
    }
};
