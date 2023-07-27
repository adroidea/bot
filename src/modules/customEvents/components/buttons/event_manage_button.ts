import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('event_manage_unrsvp_button')
        .setLabel('unRSVP')
        .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
        .setCustomId('event_manage_edit_data_button')
        .setLabel("Modifier l'évenement")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('event_manage_delete_button')
        .setLabel("Annuler l'évenement")
        .setStyle(ButtonStyle.Danger)
);

module.exports = {
    data: {
        name: `event_manage_button`
    },
    async execute(interaction: ButtonInteraction) {
        return interaction.reply({
            content: "Vous avez rejoint l'événement !",
            ephemeral: true,
            components: [row]
        });
    }
};
