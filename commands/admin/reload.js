module.exports = {
    name: 'reload',
    description: '[ADMIN] Relancer le bot',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'reload',
    examples: ['reload'],
        /**
     * Exit the bot when requested
     * @param {ClientOptions} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} interaction - Represents a command interaction.
     */
    async runInteraction(client, interaction) {
        // Exit the bot in order to reload it if there is a bug or a crash
        await interaction.reply({content: 'Relancement du bot en cours, je reviens !', ephemeral: true});
        return process.exit();
    }
};
