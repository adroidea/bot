module.exports = {
    name: 'interactionCreate',
    once: false,
    /**
     * Command to remove default channels for the server in the database
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {BaseInteraction} interaction - Represents a command interaction.
     */
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            let guildSettings = await client.getGuild(interaction.guild);
            if (!guildSettings) {
                guildSettings = await client.createGuild(interaction.guild);
            }

            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                return interaction.reply({
                    content: "Cette commande n'existe pas !",
                    ephemeral: true
                });
            }

            if (!interaction.member.permissions.has([cmd.permissions])) {
                return interaction.reply({
                    content: "Tu n'as pas le droit d'utiliser cette commande !",
                    ephemeral: true
                });
            }
            cmd.runInteraction(client, interaction, guildSettings);
        }
    }
};
