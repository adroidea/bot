module.exports = {
    name: 'interactionCreate',
    once: false,
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
            if (!interaction.member.permissions.has([cmd.permissions]))
                return interaction.reply({
                    content: "Tu n'as pas le droit d'utiliser cette commande !",
                    ephemeral: true
                });
            cmd.runInteraction(client, interaction, guildSettings);
        }
    }
};
