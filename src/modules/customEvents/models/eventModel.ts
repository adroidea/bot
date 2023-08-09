import mongoose from 'mongoose';

export interface IEvent {
    id: string;
    name: string;
    description?: string;
    date: Date;
    maxParticipants?: number | null;
    participantsId: string[];
    guildId: string;
    channelId: string;
    messageId: string;
}

const eventSchema = new mongoose.Schema<IEvent>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    maxParticipants: { type: Number },
    participantsId: { type: [String], required: true },
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String }
});

export const EventModel = mongoose.model<IEvent>('Event', eventSchema);
