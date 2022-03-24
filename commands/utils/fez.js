const {MessageActionRow, MessageButton} = require('discord.js');

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('pingPromo')
            .setLabel('Ping pour les promos intéréssantes')
            .setStyle('DANGER')
            .setEmoji('<:discount:817553283517513760>'),

        new MessageButton()
            .setCustomId('pingStreamStart')
            .setLabel('Ping pour les promos intéréssantes')
            .setStyle('DANGER')
            .setEmoji('<:discount:817553283517513760>'),

        new MessageButton()
            .setCustomId('serverAccess')
            .setLabel('Ping pour les promos intéréssantes')
            .setStyle('DANGER')
            .setEmoji('<:discount:817553283517513760>')
    );

module.exports = {
    name: 'fez',
    description: 'get the ping of the bot',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    usage: 'ping',
    exemples: ['ping'],
    async run(client, message) {
        await message.channel.send({content: 'Avoir new Role', components: [buttons]});
    }

};
