import { EventModel, IEvent } from '../../../models';
import { quote, userMention } from 'discord.js';

const createEvent = async (eventData: IEvent): Promise<IEvent | null> => {
    try {
        const createdEvent = await EventModel.create(eventData);
        return createdEvent.id;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getEventById = async (eventId: string): Promise<IEvent | null> => {
    return EventModel.findOne({ id: eventId });
};

const addParticipantToEvent = async (
    eventId: string,
    participantId: string
): Promise<IEvent | null> => {
    const event = await EventModel.findOne({ id: eventId });
    if (!event) return null;

    if (event.participantsId.includes(participantId)) return event;

    event.participantsId.push(participantId);
    const updatedEvent = await event.save();
    return updatedEvent;
};

const removeParticipantFromEvent = async (
    eventId: string,
    participantId: string
): Promise<IEvent | null> => {
    const event = await EventModel.findOne({ id: eventId });
    if (!event) return null;

    const participantIndex = event.participantsId.findIndex((id: string) => id === participantId);
    if (participantIndex === -1) {
        return event;
    }

    event.participantsId.splice(participantIndex, 1);

    const updatedEvent = event.save();

    return updatedEvent;
};

const deleteEvent = async (eventId: string): Promise<void> => {
    try {
        EventModel.findOneAndDelete({ id: eventId });
    } catch (error) {
        console.error(error);
    }
};

const updateMessage = (eventData: IEvent): string => {
    const description = eventData.description;
    let participants = '';

    const nbParticipants = eventData.participantsId.length;
    const participantsList = eventData.participantsId
        .map((id: string) => quote(userMention(id)))
        .join('\n');

    if (eventData.maxParticipants) {
        participants += `**Participants (${
            nbParticipants > eventData.maxParticipants ? eventData.maxParticipants : nbParticipants
        }/${eventData.maxParticipants})**`;
        participants +=
            nbParticipants > 0
                ? `\n${eventData.participantsId
                      .slice(0, eventData.maxParticipants)
                      .map((id: string) => quote(userMention(id)))
                      .join('\n')}`
                : '\n> Aucun participant';

        if (nbParticipants > eventData.maxParticipants) {
            const waitingList = eventData.participantsId
                .slice(eventData.maxParticipants)
                .map((id: string) => quote(userMention(id)))
                .join('\n');

            participants += `\n\n**File d'attente (${
                nbParticipants - eventData.maxParticipants
            })**`;
            participants += `\n${waitingList}`;
        }
    } else {
        participants += `**Participants (${nbParticipants})**`;
        participants += nbParticipants > 0 ? `\n${participantsList}` : '\n> Aucun participant';
    }
    return description + '\n\n' + participants;
};

const EventManagerService = {
    addParticipantToEvent,
    createEvent,
    deleteEvent,
    getEventById,
    removeParticipantFromEvent,
    updateMessage
};

export default EventManagerService;
