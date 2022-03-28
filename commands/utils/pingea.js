const {MessageEmbed} = require('discord.js');
const {type} = require('../users/userInfo');

module.exports = {
    name: 'pingea',
    description: 'get the ping of the bot',
    category: "utils",
    permissions: ['SEND_MESSAGES'],
    usage: 'ping',
    exemples: ['ping'],
    async runInteraction(client, interaction) {
        const sentMessage = await interaction.reply({content: 'Pong !', fetchReply: 'true', ephemeral: true});

        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .addField('Latence bot', `\`\`\`${sentMessage.createdTimestamp - interaction.createdTimestamp}ms\`\`\``, true)
            .addField('Latence api', `\`\`\`${client.ws.ping}ms\`\`\``, true)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        interaction.editReply({content: ' ', embeds: [embed]})
    }
};
