import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

module.exports = {
  data: {
    name: `event_manage_edit_data_button`
  },
  async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("My Modal");

    const eventTitleInput = new TextInputBuilder()
      .setCustomId("eventTitleInput")
      .setLabel("Titre de l'événement")
      .setPlaceholder("Titre de l'événement")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const eventDescriptionInput = new TextInputBuilder()
      .setCustomId("eventDescriptionInput")
      .setLabel("Description de l'événement")
      .setPlaceholder("Description de l'événement")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const eventDateInput = new TextInputBuilder()
      .setCustomId("eventDateInput")
      .setLabel("Date de l'événement")
      .setPlaceholder("Date de l'événement (ex: 01/01/2024)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const eventMaxParticipantsInput = new TextInputBuilder()
      .setCustomId("eventMaxParticipantsInput")
      .setLabel("Nombre de participants maximum")
      .setPlaceholder("Nombre de participants maximum")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const eventImageInput = new TextInputBuilder()
      .setCustomId("eventImageInput")
      .setLabel("Image de l'événement")
      .setPlaceholder("URL de l'image de l'événement")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const eventTitleActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        eventTitleInput
      );
    const eventDescriptionActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        eventDescriptionInput
      );
    const eventDateActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        eventDateInput
      );
    const eventMaxParticipantsActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        eventMaxParticipantsInput
      );
    const eventImageActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        eventImageInput
      );

    // Add inputs to the modal
    modal.addComponents(
      eventTitleActionRow,
      eventDescriptionActionRow,
      eventDateActionRow,
      eventMaxParticipantsActionRow,
      eventImageActionRow
    );

    // Show the modal to the user
    await interaction.showModal(modal);
  }
};
