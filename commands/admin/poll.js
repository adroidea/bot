module.exports = {
    name: 'poll',
    description: '[ADMIN] Créer un sondage',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'poll [question] [choix] <description> <image> <vote_unique>',
    examples: ['poll question:Vous préférez manger quoi ? (feur) choix:Burger Chèvre Miel, Lasagnes, Rien'],
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
        },
        {
            name:'description',
            description:'Une description du sondage en cours',
            required:false
        },
        {
            name:'image',
            description:'lien d\'une image pour le sondage',
            required:false
        },
        {
            name:'choix_multpiples',
            description:'définis si l\'utilisateur peut voter plusieurs fois ou non',
            required:false,
            choices: [
                {
                    name: 'Multiple',
                    value: 'true'
                },
                {
                    name: 'Vote unique',
                    value: 'false'
                }
            ]
        }
    ],
    /**
 * Starts a poll in the asked channel
 * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
 * @param {CommandInteraction} interaction - Represents a command interaction.
 */
    async runInteraction(client, interaction) {
        const question = interaction.options.getString('question');
        const choices = interaction.options.getString('choix');
        const description = interaction.options.getString('description');
        const imageURL = interaction.options.getString('image');


        await interaction.reply({content: 'Relancement du bot en cours, je reviens !', ephemeral: true});
        return process.exit();
    }
};
