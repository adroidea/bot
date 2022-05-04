module.exports = {
    name: 'reply',
    description: 'No desc.',
    category: 'No categ.',
    permissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'text',
            type: 'STRING',
            description: 'No desc.',
            required: true
        }
    ],
    runInteraction(client, interaction) {
        if (interaction.member.id === '294916386072035328') {
            interaction.channel.sendTyping();
            const reply = interaction.options.getString('text');
            interaction.channel.send(reply);
        }
    }
};
