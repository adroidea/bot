const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'pingea',
    description: 'Renvoie le ping du bot',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    usage: 'ping',
    examples: ['ping'],
    /**
     * Makes a request in order to get the bot and the API ping 
     * @param {ClientOptions} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} interaction - Represents a command interaction.
     */
    async runInteraction(client, interaction) {
        const sentMessage = await interaction.reply({
            content: 'Pong !',
            fetchReply: 'true',
            ephemeral: true
        });

        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .addField(
                'Latence bot',
                `\`\`\`${
                    sentMessage.createdTimestamp - interaction.createdTimestamp
                }ms\`\`\``,
                true
            )
            .addField('Latence api', `\`\`\`${client.ws.ping}ms\`\`\``, true)
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();
        interaction.editReply({ content: ' ', embeds: [embed] });
    }
};
