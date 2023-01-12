module.exports = {
    name: 'poll',
    description: '[ADMIN] Créer un sondage avec différents choix',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'poll <question> <number of choices> <choices>',
    examples: ['reload'],
    options: [
        {
            name: 'question',
            description: 'question du sondage',
            type: 'STRING',
            required: true
        }, 
        {
            name: 'choix',
            description: 'Différents choix séparés d\'une virgule (ex:Agrou, DBD, Valo)',
            required: true
        }
    ],
    /**
 * Starts a poll in the asked channel
 * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
 * @param {CommandInteraction} interaction - Represents a command interaction.
 */
    async runInteraction(client, interaction) {
        // Exit the bot in order to reload it if there is a bug or a crash
        await interaction.reply({content: 'Relancement du bot en cours, je reviens !', ephemeral: true});
        return process.exit();
    }
};
