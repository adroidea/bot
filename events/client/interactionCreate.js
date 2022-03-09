module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                return interaction.reply('This command doesn\'t exist !');
            }
            cmd.runInteraction(client, interaction);
        }
    }
};
