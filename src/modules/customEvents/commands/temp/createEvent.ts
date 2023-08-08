import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    PermissionsBitField
} from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import CustomEventService from '../../services/customEventService';
import { IEvent } from '../../models';
import { addToAppropriateQueue } from '../../tasks/CustomEvents.queue';

module.exports = {
    data: {
        name: 'event',
        description: 'Créer un évènement',
        options: [
            {
                name: 'url-id',
                description: "url ou id de l'évènement",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'description',
                description: "Description de l'évènement",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: 'maxparticipants',
                description: "Nombre de participants max, les autres seront en file d'attente",
                type: ApplicationCommandOptionType.Number,
                required: false
            }
        ]
    },
    category: 'events',
    permissions: [PermissionsBitField.Flags.ManageEvents],
    guildOnly: false,
    usage: '',
    examples: [''],

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const eventInput = interaction.options.getString('url-id')!;
        let description =
            interaction.options.getString('description')?.replaceAll('\\n', '\n\n') ?? '';
        const maxParticipants = interaction.options.getNumber('maxparticipants');

        const urlRegex = /event=/;
        const urlRegex2 = /\/events\/(\d+)\/(\d+)/;
        let eventId = eventInput;

        if (urlRegex.test(eventInput)) {
            eventId = eventInput.split(urlRegex)[1];
        }

        if (urlRegex2.test(eventInput)) {
            eventId = eventInput.split(urlRegex2)[2];
        }

        //const tryEvent = await CustomEventService.getEventById(eventId);
        //if (tryEvent) throw CustomErrors.EventAlreadyExistsError;

        const discordEvent = await interaction.guild!.scheduledEvents.fetch(eventId);
        if (!discordEvent) throw CustomErrors.EventNotFoundError;

        const subs = await discordEvent.fetchSubscribers();

        const inviteURL = await discordEvent.createInviteURL({ maxAge: 0, unique: false });
        const date = new Date(discordEvent.scheduledStartTimestamp!);
        const event: IEvent = {
            id: eventId,
            name: discordEvent.name,
            description,
            maxParticipants: maxParticipants,
            date,
            guildId: interaction.guildId!,
            participantsId: [],
            channelId: interaction.channelId,
            messageId: ''
        };
        for (const sub of subs) {
            event.participantsId.push(sub[0]);
        }

        description = CustomEventService.updateMessage(event) + '\n\n' + inviteURL;

        const message = await interaction.channel!.send({
            content: `${description}`
        });

        await interaction.reply({
            content: 'Event créé avec succès !',
            ephemeral: true
        });

        event.messageId = message.id;
        addToAppropriateQueue(eventId, event);
        await CustomEventService.createEvent(event);
    }
};
