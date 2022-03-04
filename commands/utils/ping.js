const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'get the ping of the bot',
    run(client, message, args) {
        const embed = new MessageEmbed()
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {name: 'Bot Latency', value: `\` ${client.ws.ping}ms\``, inline: true},
                {name: 'Uptime', value: ` <t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true}
            )
            .setFooter({text: message.author.username, iconURL: message.author.displayAvatarURL()})
            .setTimestamp();
        message.channel.send({embeds: [embed]});

    },
    runSlash(client, interaction) {
        const embed = new MessageEmbed()
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {name: 'Bot Latency', value: `\` ${client.ws.ping}ms\``, inline: true},
                {name: 'Uptime', value: ` <t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true}
            )
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        interaction.reply({embeds: [embed]});
    }
};
