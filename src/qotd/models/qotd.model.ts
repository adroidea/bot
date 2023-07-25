import mongoose from 'mongoose';

export interface IQOtD {
    enabled: boolean;
    channelId: string;
    pingedRoleId?: string;
    requestChannelId: string;
}

export interface IQuestions {
    question: string;
    authorId: string;
    guildId: string;
}

export const qotdSchema = new mongoose.Schema<IQOtD>({
    enabled: { type: Boolean, default: false },
    channelId: { type: String, required: true },
    pingedRoleId: { type: String, default: '' },
    requestChannelId: { type: String, required: true }
});

export const questionsSchema = new mongoose.Schema<IQuestions>({
    question: { type: String, required: true },
    authorId: { type: String, required: true },
    guildId: { type: String, required: true }
});

export const QuestionsModel = mongoose.model<IQuestions>('questions', questionsSchema);
