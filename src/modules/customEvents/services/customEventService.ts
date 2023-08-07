import { EventModel, IEvent } from '../../../models';
import { CustomErrors } from '../../../utils/errors';

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

    const participantIndex = event.participantsId.findIndex(id => id === participantId);
    if (participantIndex === -1) {
        return event;
    }

    event.participantsId.splice(participantIndex, 1);

    const updatedEvent = event.save();

    return updatedEvent;
};

const deleteEvent = async (eventId: string): Promise<void> => {
    const event = EventModel.findOne({ id: eventId });
    if (!event) throw CustomErrors.EventNotFoundError;
    try {
        EventModel.findOneAndDelete({ id: eventId });
    } catch (error) {
        console.error(error);
    }
};

const CustomEventService = {
    addParticipantToEvent,
    createEvent,
    deleteEvent,
    getEventById,
    removeParticipantFromEvent
};

export default CustomEventService;
