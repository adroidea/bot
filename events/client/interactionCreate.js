module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                return interaction.reply('This command doesn\'t exist !');
            }
            if(!interaction.member.permissions.has([cmd.permissions])) return interaction.reply({content : 'You are not allowed to use this command.', ephemeral: true});
            cmd.runInteraction(client, interaction);
        }
    }
};
