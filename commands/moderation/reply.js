const { OWNER_ID } = require('../../utils/config');
const { ApplicationCommandOptionType } = require("discord.js");

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
            type: ApplicationCommandOptionType.String,
            description: 'No desc.',
            required: true
        }
    ],
    /**
     * Send the given string in the current channel
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {CommandInteraction} interaction - Represents a command interaction.
     */
    async runInteraction(client, interaction) {
        if (interaction.member.id === OWNER_ID) {
            const reply = interaction.options.getString('text');
            await interaction.channel.send(reply);
        }
    }
};
