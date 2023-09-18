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
        publicLogChannel: { type: String, default: '', required: true }
    },
    privateLogs: {
        enabled: { type: Boolean, default: false, required: true },
        privateLogChannel: { type: String, default: '', required: true },
        notLoggedChannels: { type: [String], default: [], required: true }
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
    modules: {
        eventManagement: eventManagementSchema,
        notifications: notificationsSchema,
        qotd: qotdSchema,
        temporaryVoice: temporaryVoiceSchema,
        twitchLive: twitchLiveSchema
    }
});

export const GuildModel = mongoose.model<IGuild>('Guild', guildSchema);
