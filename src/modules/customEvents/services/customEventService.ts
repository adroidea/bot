import { EventModel, IEvent } from '../../../models';
import { CustomErrors } from '../../../utils/errors';

async function createEvent(eventData: IEvent): Promise<IEvent | null> {
    try {
        const createdEvent = await EventModel.create(eventData);
        return createdEvent.id;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getEventById(eventId: string): Promise<IEvent | null> {
    return EventModel.findById(eventId);
}

async function addParticipantToEvent(
    eventId: string,
    participantId: string
): Promise<IEvent | null> {
    const event = await EventModel.findById(eventId);
    if (!event) throw CustomErrors.EventNotFoundError;

    if (event.participantsId.includes(participantId)) throw CustomErrors.AlreadyParticipantError;

    event.participantsId.push(participantId);
    const updatedEvent = await event.save();
    return updatedEvent;
}

async function removeParticipantFromEvent(
    eventId: string,
    participantId: string
): Promise<IEvent | null> {
    const event = await EventModel.findById(eventId);
    if (!event) throw CustomErrors.EventNotFoundError;

    const participantIndex = event.participantsId.findIndex(id => id === participantId);
    if (participantIndex === -1) {
        throw CustomErrors.ParticipantNotFoundError;
    }

    // Remove the participant from the event
    event.participantsId.splice(participantIndex, 1);

    // Save the updated event
    const updatedEvent = event.save();

    return updatedEvent;
}

async function deleteEvent(eventId: string): Promise<void> {
    const event = await EventModel.findById(eventId);
    if (!event) throw CustomErrors.EventNotFoundError;
    try {
        await EventModel.findByIdAndDelete(eventId);
    } catch (error) {
        console.error(error);
    }
}

const CustomEventService = {
    createEvent,
    getEventById,
    addParticipantToEvent,
    removeParticipantFromEvent,
    deleteEvent
};

export default CustomEventService;
