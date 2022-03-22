const {MessageEmbed} = require('discord.js');
const {type} = require('../users/userInfo');

module.exports = {
    name: 'ping',
    description: 'get the ping of the bot',
    category: "utils",
    usage:'ping',
    exemples:['ping'],
    async run(client, message) {
        const sentMessage = await message.channel.send('Pong !');

        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .addField('Latence bot', `\`\`\`${sentMessage.createdTimestamp - message.createdTimestamp}ms\`\`\``, true)
            .addField('Latence api', `\`\`\`${client.ws.ping}ms\`\`\``, true)
            .setFooter({text: message.author.username, iconURL: message.author.displayAvatarURL()})
            .setTimestamp();
        sentMessage.edit({content: ' ', embeds: [embed]})

    },
    async runInteraction(client, interaction) {
        const sentMessage = await interaction.reply({content:'Pong !', fetchReply:'true'});

        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .addField('Latence bot', `\`\`\`${sentMessage.createdTimestamp - interaction.createdTimestamp}ms\`\`\``, true)
            .addField('Latence api', `\`\`\`${client.ws.ping}ms\`\`\``, true)
            .setFooter({text:interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        interaction.editReply({content: ' ', embeds: [embed]})
    }
};
