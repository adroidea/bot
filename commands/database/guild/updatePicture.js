const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'updatepic',
    description: '[ADMIN] Configurer la photo de profil du serveur',
    category: 'database',
    permissions: ['ADMINISTRATOR'],
    usage: 'updatepic [link]',
    examples: [
        'updatepic https://cdn.discordapp.com/attachments/1050382523261276210/1050382808645894164/icone-discord.png'
    ],
    options: [
        {
            name: 'default',
            description: 'Photo hors steram',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'live',
            description: "Photo lors d'un stream",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    /**
     * Command to update the profile picture link (either for when i'm streaming or not) for the server in the database
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {CommandInteraction} interaction - Represents a command interaction.
     */
    async runInteraction(client, interaction) {
        const defaultPic = interaction.options.getString('default');
        const livePic = interaction.options.getString('live');

        // Updates the default profile picture link to the database, used when i'm not live
        if (defaultPic !== null) {
            await client.updateGuild(interaction.guild, {
                defaultProfilePicture: defaultPic
            });
            interaction.reply({
                content: `La photo de profil sera mise à jour à la fin du prochain stream`,
                ephemeral: true
            });
        }
        // Updates the live profile picture link to the database, used when i'm live
        if (livePic !== null) {
            await client.updateGuild(interaction.guild, {
                liveProfilePicture: livePic
            });
            interaction.reply({
                content: `La photo de profil sera mise à jour au prochain stream`,
                ephemeral: true
            });
        }
    }
};