import mongoose from 'mongoose';

export interface ITemporaryVoice {
    enabled: boolean;
    hostChannels: string[];
    protectedChannels: string[];
}

export const temporaryVoiceSchema = new mongoose.Schema<ITemporaryVoice>({
    enabled: { type: Boolean, default: false, required: true },
    hostChannels: { type: [String], default: [], required: true },
    protectedChannels: { type: [String], default: [], required: true }
});
