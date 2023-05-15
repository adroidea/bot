import mongoose from "mongoose";

export interface IEvent {
  title: string;
  description: string | null;
  date: Date;
  duration?: string | null;
  imageURL?: string | null;
  maxParticipants?: number | null;
  participantsId: string[];
}

const eventSchema = new mongoose.Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  duration: { type: String },
  imageURL: { type: String },
  maxParticipants: { type: Number },
  participantsId: { type: [String], required: true }
});

export const EventModel = mongoose.model<IEvent>("Event", eventSchema);
