module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
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
            cmd.runInteraction(client, interaction);
        }
    }
};
