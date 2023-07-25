import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    PermissionsBitField
} from 'discord.js';

module.exports = {
    data: {
        name: 'r',
        description: 'r',
        options: [
            {
                name: 'r',
                description: 'r',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    category: 'misc',
    permissions: [PermissionsBitField.Flags.Administrator],
    usage: 'idk dude.',
    examples: ["still don't know"],

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const message = interaction.options.getString('r')!;

        await interaction.channel?.sendTyping();
        await interaction.channel!.send(message);
        return interaction.reply({ content: 'done', ephemeral: true });
    }
};
