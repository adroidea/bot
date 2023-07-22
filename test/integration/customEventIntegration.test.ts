import { EventModel } from '../../src/models/eventModel';
import mongoose from 'mongoose';
require('dotenv').config();

const newEvent = new EventModel({
    title: 'Test Event',
    description: 'This is a test event',
    date: new Date(),
    duration: '2 hours',
    imageURL: 'https://example.com/image.jpg',
    maxParticipants: 10,
    participantsId: ['user1', 'user2'],
    guildId: 'id1',
    channelId: 'idchannel1'
});

const mongoURI = process.env.MONGO_URI ?? 'mongodb://root:example@mongo:27017/';

describe('EventModel', () => {
    beforeAll(async () => {
        jest.setTimeout(40000);
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should save an event to the database', async () => {
        jest.setTimeout(45000);

        const savedEvent = await newEvent.save();
        expect(savedEvent).not.toBeNull();
    });

    it('should update an event in the database', async () => {
        jest.setTimeout(5000);

        const savedEvent = await newEvent.save();
        const eventId = savedEvent._id;

        const updatedEvent = await EventModel.findByIdAndUpdate(
            eventId,
            { title: 'Updated Test Event' },
            { new: true }
        );

        expect(updatedEvent).not.toBeNull();
        expect(updatedEvent).not.toBe(savedEvent);
        expect(updatedEvent?.title).toBe('Updated Test Event');
    });

    it('should delete an existing event from the database', async () => {
        jest.setTimeout(45000);

        const savedEvent = await newEvent.save();
        const eventId = savedEvent._id;

        const deletedEvent = await EventModel.findByIdAndDelete(eventId);
        expect(deletedEvent).not.toBeNull();

        const findDeletedEvent = await EventModel.findById(eventId);
        expect(findDeletedEvent).toBeNull();
    });
});

it('should not save an event with a missing title', async () => {
    jest.setTimeout(45000);

    const invalidEvent = new EventModel({
        description: 'This is a test event',
        date: new Date(),
        duration: '2 hours',
        imageURL: 'https://example.com/image.jpg',
        maxParticipants: 10,
        participantsId: ['user1', 'user2'],
        guildId: 'id1',
        channelId: 'idchannel1'
    });

    try {
        await invalidEvent.save();
    } catch (error: any) {
        expect(error).not.toBeNull();
        expect(error.errors.title).toBeDefined();
    }
});
