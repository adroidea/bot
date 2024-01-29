import {
    APIEmbedField,
    Client,
    EmbedBuilder,
    Events,
    GuildScheduledEvent,
    GuildScheduledEventStatus,
    MessageCreateOptions
} from 'discord.js';
import { IGuild } from 'adroi.d.ea';
import ScheduledEventService from '../../services/scheduledEventService';
import guildService from '../../../../services/guild.service';
import { timestampToDate } from '../../../../utils/botUtil';

export default {
    name: Events.GuildScheduledEventUpdate,
    async execute(client: Client, oldEvent: GuildScheduledEvent, newEvent: GuildScheduledEvent) {
        const guildSettings: IGuild = await guildService.getOrCreateGuild(oldEvent.guild!);

        const event = await ScheduledEventService.getEventById(oldEvent.id);
        if (!event) return;

        //const eventManagement = guildSettings.modules.eventManagement;
        //if (!eventManagement.enabled) return;

        let message: MessageCreateOptions;

        switch (true) {
            case oldEvent.status !== GuildScheduledEventStatus.Active &&
                newEvent.status === GuildScheduledEventStatus.Active:
                message = eventStart(newEvent);
                break;

            case oldEvent.status !== GuildScheduledEventStatus.Canceled &&
                newEvent.status === GuildScheduledEventStatus.Canceled:
                message = eventCanceled(newEvent);
                break;

            default:
                message = eventDataUpdate(oldEvent, newEvent);
                break;
        }

        for (const participant of event.participantsId) {
            const user = await client.users.fetch(participant);
            user.send(message);
        }
    }
};

//TODO : see what to do about the description update
const eventDataUpdate = (
    oldEvent: GuildScheduledEvent,
    newEvent: GuildScheduledEvent
): MessageCreateOptions => {
    const updateEmbed = new EmbedBuilder()
        .setTitle('Évènement mis à jour')
        .setDescription(
            `L'évènement **__${oldEvent.name}__** a été mis à jour. Voici les changements :`
        )
        .setColor([45, 249, 250])
        .setTimestamp();

    const fields: APIEmbedField[] = [];
    if (oldEvent.name !== newEvent.name) {
        fields.push(
            {
                name: 'Ancien nom',
                value: oldEvent.name,
                inline: true
            },
            {
                name: 'Nouveau nom',
                value: newEvent.name,
                inline: true
            }
        );
    }

    //TODO : reminders update
    if (oldEvent.scheduledStartTimestamp !== newEvent.scheduledStartTimestamp) {
        const oldTimestamp = timestampToDate(oldEvent.scheduledStartTimestamp!);
        const newTimestamp = timestampToDate(newEvent.scheduledStartTimestamp!);

        fields.push(
            {
                name: 'Ancienne Date de début',
                value: `<t:${oldTimestamp}:f>  <t:${oldTimestamp}:R>`,
                inline: true
            },
            {
                name: 'nouvelle Date de début',
                value: `<t:${newTimestamp}:f>  <t:${newTimestamp}:R>`,
                inline: true
            }
        );
    }

    if (oldEvent.channelId !== newEvent.channelId) {
        fields.push(
            {
                name: 'Ancien salon',
                value: `<#${oldEvent.channelId}>`,
                inline: true
            },
            {
                name: 'Nouveau salon',
                value: `<#${newEvent.channelId}>`,
                inline: true
            }
        );
    }

    const fieldsWithEmpty: APIEmbedField[] = [];
    for (let i = 0; i < fields.length; i++) {
        fieldsWithEmpty.push(fields[i]);

        if (i < fields.length - 1 && i % 2 === 1) {
            fieldsWithEmpty.push({ name: '\u200B', value: '\u200B' });
        }
    }

    updateEmbed.addFields(fieldsWithEmpty);

    if (newEvent.coverImageURL()) updateEmbed.setImage(newEvent.coverImageURL());

    return {
        embeds: [updateEmbed]
    };
};

const eventStart = (newEvent: GuildScheduledEvent): MessageCreateOptions => {
    const startEmbed = new EmbedBuilder()
        .setTitle('Évènement commencé')
        .setDescription(
            `L'évènement **__${newEvent.name}__** a commencé. Tout le monde t'attend ici : <#${newEvent.channelId}>`
        )
        .setTimestamp();

    if (newEvent.coverImageURL()) startEmbed.setImage(newEvent.coverImageURL());
    return {
        embeds: [startEmbed]
    };
};

export const eventCanceled = (event: GuildScheduledEvent): MessageCreateOptions => {
    const timestamp = timestampToDate(event.scheduledStartTimestamp!);
    const cancelEmbed = new EmbedBuilder()
        .setTitle(`[ANNULÉ] ${event.name}`)
        .addFields([
            {
                name: '**Date**',
                value: `<t:${timestamp}:F>`
            }
        ])
        .setTimestamp();
    ScheduledEventService.deleteEvent(event.id);
    return {
        content: `Salut ! Mauvaise nouvelle, l'événement "${event.name}" prévu le <t:${timestamp}:F> a été annulé.`,
        embeds: [cancelEmbed]
    };
};
