import {
    Client,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
    codeBlock
} from 'discord.js';

module.exports = {
    data: {
        name: 'pingea',
        description: 'Renvoie le ping du bot'
    },
    category: 'utils',
    cooldown: 10,
    permissions: [PermissionsBitField.Flags.SendMessages],
    guildOnly: false,
    usage: 'pingea',
    examples: ['pingea'],

    async execute(client: Client, interaction: CommandInteraction) {
        const sentMessage = await interaction.reply({
            content: 'Pong !',
            fetchReply: true,
            ephemeral: true
        });

        const botLantency = sentMessage.createdTimestamp - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setThumbnail(client.user!.displayAvatarURL())
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .addFields([
                {
                    name: 'Latence bot',
                    value: codeBlock('sci', `${botLantency.toString()}ms`),
                    inline: true
                },
                {
                    name: 'Latence api',
                    value: codeBlock('sci', `${client.ws.ping.toString()}ms`),
                    inline: true
                }
            ])
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();
        return interaction.editReply({ embeds: [embed] });
    }
};
