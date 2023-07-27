import mongoose from 'mongoose';

export interface ITemporaryVoice {
    enabled: boolean;
    hostChannels?: string[];
    protectedChannels?: string[];
}

export const temporaryVoiceSchema = new mongoose.Schema<ITemporaryVoice>({
    enabled: { type: Boolean, default: false },
    hostChannels: { type: [String], default: [] },
    protectedChannels: { type: [String], default: [] }
});
