import { IQOTDModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

export interface IQuestions {
    _id?: string;
    question: string;
    authorId: string;
    guildId: string;
}

export const qotdSchema = new mongoose.Schema<IQOTDModule>({
    enabled: Boolean,
    channelId: String,
    proposedChannelId: String,
    pingedRoleId: String,
    blacklist: [String],
    whitelist: [String],
    questionsThreshold: Number,
    bannedWords: [String]
});

export const questionsSchema = new mongoose.Schema<IQuestions>({
    question: { type: String, required: true },
    authorId: { type: String, required: true },
    guildId: { type: String, required: true }
});

export const QuestionsModel = mongoose.model<IQuestions>('questions', questionsSchema);
