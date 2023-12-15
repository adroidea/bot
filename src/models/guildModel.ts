import { IQOtD, qotdSchema } from '../modules/qotd/models';
import { ITemporaryVoice, temporaryVoiceSchema } from '../modules/tempVoice/models';
import { ITwitchLive, twitchLiveSchema } from '../modules/twitchLive/models';

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
    enabled: { type: Boolean, default: false, required: true },
    publicLogs: {
        enabled: { type: Boolean, default: false, required: true },
        publicLogChannel: { type: String, default: '' }
    },
    privateLogs: {
        enabled: { type: Boolean, default: false, required: true },
        privateLogChannel: { type: String, default: '' },
        notLoggedChannels: { type: [String], default: [] }
    }
});

export interface IEventManagement {
    enabled: boolean;
}

const eventManagementSchema = new mongoose.Schema<IEventManagement>({
    enabled: { type: Boolean, default: false, required: true }
});

export interface IGuild {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    modules: {
        eventManagement: IEventManagement;
        notifications: INotifications;
        qotd: IQOtD;
        temporaryVoice: ITemporaryVoice;
        twitchLive: ITwitchLive;
    };
}

const guildSchema = new mongoose.Schema<IGuild>({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    },
    banner: {
        type: String,
        required: false
    },
    modules: {
        eventManagement: eventManagementSchema,
        notifications: notificationsSchema,
        qotd: qotdSchema,
        temporaryVoice: temporaryVoiceSchema,
        twitchLive: twitchLiveSchema
    }
});

export const GuildModel = mongoose.model<IGuild>('Guild', guildSchema);
