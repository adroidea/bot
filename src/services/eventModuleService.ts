import {
  AlreadyParticipantError,
  EventNotFoundError,
  ParticipantNotFoundError
} from "../utils/errors";
import { EventModel, IEvent } from "../models";

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
  if (!event) throw EventNotFoundError;

  if (event.participantsId.includes(participantId))
    throw AlreadyParticipantError;

  event.participantsId.push(participantId);
  const updatedEvent = await event.save();
  return updatedEvent;
}

async function removeParticipantFromEvent(
  eventId: string,
  participantId: string
): Promise<IEvent | null> {
  const event = await EventModel.findById(eventId);
  if (!event) throw EventNotFoundError;

  const participantIndex = event.participantsId.findIndex(
    id => id === participantId
  );
  if (participantIndex === -1) {
    throw ParticipantNotFoundError;
  }

  // Remove the participant from the event
  event.participantsId.splice(participantIndex, 1);

  // Save the updated event
  const updatedEvent = await event.save();

  return updatedEvent;
}

async function deleteEvent(eventId: string): Promise<void> {
  const event = await EventModel.findById(eventId);
  if (!event) throw EventNotFoundError;
  try {
    await EventModel.findByIdAndDelete(eventId);
  } catch (error) {
    console.error(error);
  }
}

const eventService = {
  createEvent,
  getEventById,
  addParticipantToEvent,
  removeParticipantFromEvent,
  deleteEvent
};

export default eventService;
