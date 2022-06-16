const { OWNER_ID } = require('../../utils/config');

module.exports = {
    name: 'r',
    description: 'No desc.',
    category: 'No categ.',
    permissions: ['ADMINISTRATOR'],
    usage: 'Would you like to know',
    examples: 'Idk man',
    options: [
        {
            name: 'text',
            type: 'STRING',
            description: 'No desc.',
            required: true
        }
    ],
    async runInteraction(client, interaction) {
        if (interaction.member.id === OWNER_ID) {
            interaction.reply({content: 'f', ephemeral: true});
            const reply = interaction.options.getString('text');
            await interaction.channel.send(reply);
        }
    }
};
