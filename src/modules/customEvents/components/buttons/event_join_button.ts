import { ButtonInteraction, EmbedBuilder, userMention } from 'discord.js';
import CustomEventService from '../../services/customEventService';

module.exports = {
    data: {
        name: `event_join_button`
    },
    async execute(interaction: ButtonInteraction) {
        let oldEmbed = interaction.message.embeds[0];
        const eventId = oldEmbed.footer?.text!;
        const createdDate = new Date(oldEmbed.timestamp!);
        const event = await CustomEventService.addParticipantToEvent(
            eventId,
            interaction.member?.user.id!
        );

        if (!event) return;

        const timestamp = Math.floor(event.date.getTime() / 1000);
        const newEmbed = new EmbedBuilder()
            .setTitle(event.title)
            .setDescription(event.description)
            .addFields([
                {
                    name: '**Date**',
                    value: `<t:${timestamp}:F> (<t:${timestamp}:R>)`
                }
            ])
            .setFooter({ text: `${eventId}` })
            .setColor(oldEmbed.color)
            .setTimestamp(createdDate);

        if (event.imageURL) {
            newEmbed.setImage(event.imageURL);
        }

        const nbParticipants = event.participantsId.length;

        const participantsList = event.participantsId.map(id => userMention(id)).join('\n');

        if (event.maxParticipants) {
            newEmbed.addFields({
                name: `Participants (${
                    nbParticipants > event.maxParticipants ? event.maxParticipants : nbParticipants
                }/${event.maxParticipants})`,
                value:
                    nbParticipants > 0
                        ? `>>> ${event.participantsId
                              .slice(0, event.maxParticipants)
                              .map(id => userMention(id))
                              .join('\n')}`
                        : '> Aucun participant'
            });

            if (nbParticipants > event.maxParticipants) {
                const waitingList = event.participantsId
                    .slice(event.maxParticipants)
                    .map(id => userMention(id))
                    .join('\n');

                newEmbed.addFields({
                    name: `File d'attente (${nbParticipants - event.maxParticipants})`,
                    value: `>>> ${waitingList}`
                });
            }
        } else {
            newEmbed.addFields({
                name: `Participants (${nbParticipants})`,
                value: nbParticipants > 0 ? `>>> ${participantsList}` : '> Aucun participant'
            });
        }

        await interaction.message.edit({ embeds: [newEmbed] });

        return interaction.reply({
            content: "Vous avez rejoint l'événement !",
            ephemeral: true
        });
    }
};
