import { ButtonInteraction, EmbedBuilder, userMention } from "discord.js";
import eventService from "../../services/eventModuleService";

module.exports = {
  data: {
    name: `event_manage_delete_button`
  },
  async execute(interaction: ButtonInteraction) {
    const messageId = interaction.message.reference?.messageId;
    if (!messageId) return;
    const message = await interaction.channel?.messages.fetch(messageId);
    if (!message) return;

    let oldEmbed = message.embeds[0];
    const eventId = oldEmbed.footer?.text!;
    const event = await eventService.getEventById(eventId);
    if (!event) return;

    const timestamp = Math.floor(event.date.getTime() / 1000);
    const newEmbed = new EmbedBuilder()
      .setTitle(`[ANNULÉ] ${event.title}`)
      .setDescription(`[ANNULÉ] ${event.description}`)
      .addFields([
        {
          name: "**Date**",
          value: `<t:${timestamp}:F>`
        }
      ])
      .setTimestamp();

    if (event.imageURL) {
      newEmbed.setImage(event.imageURL);
    }
    eventService.deleteEvent(eventId);
    await message.edit({ embeds: [newEmbed], components: [] });

    let usersNotNotified: string[] = [];

    await Promise.all(
      event.participantsId.map(async participantId => {
        try {
          const user = await interaction.client.users.fetch(participantId);
          await user.send(
            `Salut ! Mauvaise nouvelle, l'événement "${
              event.title
            }" prévu le <t:${timestamp}:F> a été annulé par ${userMention(
              interaction.member!.user.id
            )}.`
          );
        } catch (error) {
          usersNotNotified.push(participantId);
        }
      })
    );

    await interaction.update({
      content: `Cet évènement a bien été supprimé, je préviens tous les participants en MP !`,
      components: []
    });

    if (usersNotNotified.length > 0) {
      await interaction.followUp({
        content: `Je n'ai pas pu prévenir ces utilisateurs en MP :\n ${usersNotNotified
          .map(userId => `<@${userId}>`)
          .join("\n")}`,
        ephemeral: true
      });
    }
  }
};
