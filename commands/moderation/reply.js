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
    /**
     * Send the given string in the current channel
     * @param {ClientOptions} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} interaction - Represents a command interaction.
     */
    async runInteraction(client, interaction) {
        if (interaction.member.id === OWNER_ID) {
            interaction.reply({ content: 'f', ephemeral: true });
            const reply = interaction.options.getString('text');
            await interaction.channel.send(reply);
        }
    }
};
