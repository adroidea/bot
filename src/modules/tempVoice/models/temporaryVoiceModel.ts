import mongoose from 'mongoose';

export interface ITempVoiceUserSettings {
    trustedUsers: string[];
    blockedUsers: string[];
    isPublic: boolean;
}

export interface ITemporaryVoice {
    enabled: boolean;
    hostChannels: string[];
    nameModel: {
        unlocked: string;
        locked: string;
    };
    userSettings: Record<string, ITempVoiceUserSettings>;
}

export const temporaryVoiceSchema = new mongoose.Schema<ITemporaryVoice>({
    enabled: { type: Boolean, default: true, required: true },
    hostChannels: { type: [String], default: [], required: true },
    nameModel: {
        unlocked: { type: String, default: '🔊 Voc {USERNAME}' },
        locked: { type: String, default: '🔒 Voc {USERNAME}' }
    },
    userSettings: { type: Object, default: {} }
});
