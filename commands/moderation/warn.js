const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'warn <idUtilisateur> <raison>',
    examples: ['warn 294916386072035328 "Spam"'],
    description: 'Avertis un utilisateur',
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
    async runInteraction(client, interaction) {
        const iduser = interaction.options.getMember('id');
        const reason = interaction.options.getString('raison');
        const fetchGuild = await client.getGuild(interaction.guild);
        const logChannel = client.channels.cache.get(fetchGuild.privateLogChannel);
        
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

        await iduser.send({ embeds: [embed] });
        await logChannel.send({ embeds: [embed] });
    }
};
