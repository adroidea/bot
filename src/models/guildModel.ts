import { ITwitchLive, twitchLiveSchema } from '../twitchLive/models';
import mongoose from 'mongoose';

export interface INotifications {
    enabled: boolean;
    publicLogs: {
        enabled: boolean;
        publicLogChannel?: string;
    };
    privateLogs: {
        enabled: boolean;
        privateLogChannel?: string;
        notLoggedChannels?: string[];
    };
}

const notificationsSchema = new mongoose.Schema<INotifications>({
    enabled: { type: Boolean, default: false },
    publicLogs: {
        enabled: { type: Boolean, default: false },
        publicLogChannel: { type: String, default: '' }
    },
    privateLogs: {
        enabled: { type: Boolean, default: false },
        privateLogChannel: { type: String, default: '' },
        notLoggedChannels: { type: [String], default: [] }
    }
});

export interface ITemporaryVoice {
    enabled: boolean;
    hostChannels?: string[];
    protectedChannels?: string[];
}

const temporaryVoiceSchema = new mongoose.Schema<ITemporaryVoice>({
    enabled: { type: Boolean, default: false },
    hostChannels: { type: [String], default: [] },
    protectedChannels: { type: [String], default: [] }
});

export interface IEventManagement {
    enabled: boolean;
}

const eventManagementSchema = new mongoose.Schema<IEventManagement>({
    enabled: { type: Boolean, default: false }
});

export interface IGuild {
    id: string;
    modules: {
        eventManagement: IEventManagement;
        notifications: INotifications;
        temporaryVoice: ITemporaryVoice;
        twitchLive: ITwitchLive;
    };
}

const guildSchema = new mongoose.Schema<IGuild>({
    id: {
        type: String,
        required: true
    },
    modules: {
        eventManagement: eventManagementSchema,
        notifications: notificationsSchema,
        temporaryVoice: temporaryVoiceSchema,
        twitchLive: twitchLiveSchema
    }
});

export const GuildModel = mongoose.model<IGuild>('Guild', guildSchema);
