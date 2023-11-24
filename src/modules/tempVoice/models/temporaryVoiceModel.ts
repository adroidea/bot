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
//TODO: remove the default value before production
export const temporaryVoiceSchema = new mongoose.Schema<ITemporaryVoice>({
    enabled: { type: Boolean, default: true, required: true },
    hostChannels: { type: [String], default: ['1105868337789014017'], required: true },
    nameModel: {
        unlocked: { type: String, default: '🔊 Voc {USERNAME}' },
        locked: { type: String, default: '🔒 Voc {USERNAME}' }
    },
    userSettings: {
        type: Object,
        default: {
            '294916386072035328': {
                trustedUsers: ['609758025888038938'],
                blockedUsers: ['159638700316164096', '1114561938303766548'],
                isPublic: true
            }
        }
    }
});
