import { IQOTDModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

export interface IQuestions {
    _id?: string;
    question: string;
    authorId: string;
    guildId: string;
}

export const qotdSchema = new mongoose.Schema<IQOTDModule>({
    enabled: { type: Boolean, default: false, required: true },
    channelId: { type: String, default: '' },
    proposedChannelId: { type: String, default: '' },
    pingedRoleId: { type: String, default: '' },
    blacklist: { type: [String], default: [] },
    whitelist: { type: [String], default: [] },
    questionsThreshold: { type: Number, default: 7 }
});

export const questionsSchema = new mongoose.Schema<IQuestions>({
    question: { type: String, required: true },
    authorId: { type: String, required: true },
    guildId: { type: String, required: true }
});

export const QuestionsModel = mongoose.model<IQuestions>('questions', questionsSchema);
