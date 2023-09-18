import mongoose from 'mongoose';

export interface IQOtD {
    enabled: boolean;
    channelId: string;
    pingedRoleId?: string;
    requestChannelId: string;
    blacklistUsers: string[];
    trustedUsers: string[];
    warnOnLowQuestions: boolean;
    questionsThreshold: number;
}

export interface IQuestions {
    _id?: string;
    question: string;
    authorId: string;
    guildId: string;
}

export const qotdSchema = new mongoose.Schema<IQOtD>({
    enabled: { type: Boolean, default: false, required: true },
    channelId: { type: String, default: '', required: true },
    pingedRoleId: { type: String, default: '', required: true },
    requestChannelId: { type: String, default: '', required: true },
    blacklistUsers: { type: [String], default: [], required: true },
    trustedUsers: { type: [String], default: [], required: true },
    warnOnLowQuestions: { type: Boolean, default: true, required: true },
    questionsThreshold: { type: Number, default: 7, required: true }
});

export const questionsSchema = new mongoose.Schema<IQuestions>({
    question: { type: String, required: true },
    authorId: { type: String, required: true },
    guildId: { type: String, required: true }
});

export const QuestionsModel = mongoose.model<IQuestions>('questions', questionsSchema);
